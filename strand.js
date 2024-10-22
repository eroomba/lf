const strandOps = { 
    name: "strand", 
    type: "strand", 
    weight: 2.2,
    data: "strand", 
    content: "<div class=\"st-cn\">&nbsp;</div><div class=\"st-ct\">&infin;</div><div class=\"st-cn\"><!--nm--></div>",
    formula: () => { 
        return "strand"; 
    }, 
    range: 25, 
    decay: 1000,
    dformula: []
};

function updateStrand(strand) {

    if (strand.life != null)
        strand.life--;
    
    if (strand.life != null && strand.life <= 0 && strand.active) {
        strandDecay(strand.dynamic["codes"], strand.pos);
        strand.deactivate();
    }
    else {

        let spawned = false;
        let combined = false

        let close = lf.query(strand);

        let membrane = null;
        close.forEach((itm) => {
            let sums = groupObj(strand.dynamic["codes"],[snipOps["snp-ex"].data]);
            if ((itm.ops.name == "brane" || itm.ops.name == "blip") && membrane == null) {
                membrane = itm;
            }
            if (itm.ops.type == "snip") {
                if ((itm.ops.name == "snp-go" &&
                    !strand.dynamic["codes"].includes(itm.dynamic["code"]) && 
                    itm.dynamic["code"].indexOf("d") != 0) ||
                    (itm.ops.name == "snp-ex" && (!(snipOps["snp-ex"].data in sums) || sums[snipOps["snp-ex"].data] <= 2)))
                {
                    let prevLen = strand.dynamic["codes"].length;
                    strand.dynamic["codes"].push(itm.dynamic["code"]);
                    strand.obj.classList.remove("sz-" + prevLen);
                    let newLen = strand.dynamic["codes"].length;
                    if (newLen >= gVars.minStrandLen) strand.obj.classList.add("sz-full"); 
                    else strand.obj.classList.add("sz-" + newLen);
                    strand.pos.vel += itm.pos.vel;
                    strand.pos.dir += itm.pos.dir;
                    itm.deactivate();
                }
            }
            else if (itm.ops.type == "strand") {
                let nCodes = [];

                let codeLen = strand.dynamic["codes"].length + itm.dynamic["codes"].length;
                let canComb = false;
                let sumB = groupObj(itm.dynamic["codes"],[snipOps["snp-ex"].data]);
                let sumE = sums[snipOps["snp-ex"].data] + sumB[snipOps["snp-ex"].data];
                if (sumE / codeLen <= 0.25 && codeLen <= 48) { 
                    canComb = true;
                    nCodes = itm.dynamic["codes"];
                }

                if (canComb) {
                    let prevLen = strand.dynamic["codes"].length;
                    strand.dynamic["codes"].push(...nCodes);
                    strand.obj.classList.remove("sz-" + prevLen);
                    let newLen = strand.dynamic["codes"].length;
                    if (newLen >= gVars.minStrandLen) strand.obj.classList.add("sz-full"); 
                    else strand.obj.classList.add("sz-" + newLen);
                    strand.pos.vel += itm.pos.vel;
                    strand.pos.dir += itm.pos.dir;
                    itm.deactivate();
                    combined = true;
                    let dspCode = strand.dynamic["codes"].join(":");
                    let cLen = strand.dynamic["codes"].length;
                    console.log("s " + strand.id + " combined : " + dspCode + " [" + cLen + "]");
                }
            }
        });

        let cStrP = strand.dynamic["codes"].join(":");
        strand.obj.setAttribute("code",cStrP);
        if (strand.dynamic["codes"].length >= gVars.minStrandLen && membrane != null) {
            let ptDyn = {
                gen: lf.step,
                struct: [ "complex" ],
                codes: strand.dynamic["codes"]
            };

            let protoType = "proto-1a";
            if (membrane.ops.name == "blip") protoType = "proto-1b";

            let nVel = Math.floor(Math.random() * 360);
            let nDir = Math.floor(Math.random() * 9);
            let nPro= new LItem(new LVector(strand.pos.x, strand.pos.y,nDir,nVel),protoOps[protoType], ptDyn, strand.genetic);
            lf.queueItem(nPro);

            membrane.deactivate();
            strand.deactivate();
            spawned = true;
            console.log("s " + strand.id + " spawned");
        }

        if (!spawned) {
            lf.behaviors.run(strand, "reset");
            strand.dynamic["codes"].forEach((cd) => {
                lf.behaviors.run(strand, cd);
            });
            strand.obj.innerHTML = strandOps.content.replace("<!--nm-->",strand.dynamic["codes"].length);
        }
    }

    if (strand.active) {
        strand.pos.move(strand.ops.weight);
        strand.obj.style.left = strand.pos.x + "px";
        strand.obj.style.top = strand.pos.y + "px";
        strand.obj.style.transform = strand.transformFill.replace("***",strand.pos.dir); //"z " + strand.pos.dir + "deg";

        lf.encode(strand,'u');
    }
    else {
        strand.obj.style.display = "none";
    }
}

function strandDecay(strandCodes, pos) {
    let sCount = strandCodes.length;
    let sCodes = strandCodes.slice();
    let dCode = sCodes[sCodes.length - 1];
    let rCodes = sCodes.slice(0,sCodes.length - 1);
    let rCodes2 = [];
    if (rCodes.length > 2) {
        let sIdx = Math.floor(Math.random() * rCodes.length);
        rCodes2 = rCodes.slice(sIdx);
        rCodes = rCodes.slice(0,sIdx);
    }

    let oA = Math.floor(Math.random() * 360);
    if (rCodes.length > 0) {
        if (rCodes.length == 1) {
            let nDir = oA;
            let dX = 15 * Math.cos(nDir * Math.PI / 180);
            let dY = 15 * Math.sin(nDir * Math.PI / 180);
            let nVel = Math.floor(Math.random() * 5) + 10;
            let sType = "snp-go";
            if (rCodes[0] == snipOps["snp-ex"].data) sType = "snp-ex"
            let nSnp = new LItem(new LVector(pos.x + dX, pos.y + dY, nDir, nVel), snipOps[sType], {gen:lf.step, code: rCodes[0]});
            lf.queueItem(nSnp);
            oA += 360 / sCount;
            oA = oA % 360;
        }
        else {
            let nDir = oA;
            let dX = 40 * Math.cos(nDir * Math.PI / 180);
            let dY = 40 * Math.sin(nDir * Math.PI / 180);
            let nVel = Math.floor(Math.random() * 5) + 10;
            let nStd = new LItem(new LVector(pos.x + dX, pos.y + dY, nDir, nVel), strandOps, {gen:lf.step, codes: rCodes, len: rCodes.length});
            lf.queueItem(nStd);
            oA += 360 / sCount;
            oA = oA % 360;
        }
    }
    if (rCodes2.length > 0) {
        if (rCodes2.length == 1) {
            let nDir = oA;
            let dX = 40 * Math.cos(nDir * Math.PI / 180);
            let dY = 40 * Math.sin(nDir * Math.PI / 180);
            let nVel = Math.floor(Math.random() * 5) + 10;
            let sType = "snp-go";
            if (rCodes2[0] == snipOps["snp-ex"].data) sType = "snp-ex";
            let nSnp = new LItem(new LVector(pos.x + dX, pos.y + dY, nDir, nVel), snipOps[sType], {gen:lf.step, code: rCodes2[0]});
            lf.queueItem(nSnp);
            oA += 360 / sCount;
            oA = oA % 360;
        }
        else {
            let nDir = oA;
            let dX = 40 * Math.cos(nDir * Math.PI / 180);
            let dY = 40 * Math.sin(nDir * Math.PI / 180);
            let nVel = Math.floor(Math.random() * 5) + 10;
            let nStd = new LItem(new LVector(pos.x + dX, pos.y + dY, nDir, nVel), strandOps, {gen:lf.step, codes: rCodes2, len: rCodes2.length});
            lf.queueItem(nStd);
            oA += 360 / sCount;
            oA = oA % 360;
        }
    }
    let dType = "snp-go";
    if (dCode == snipOps["snp-ex"].data) dType = "snp-ex";
    if (dCode != undefined && dCode != null) {
        snipDecay(dType, dCode, pos);
    }
}