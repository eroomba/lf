const strandOps = { 
    name: "strand", 
    type: "strand", 
    weight: 2,
    data: "strand", 
    content: "&infin;",
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
        // TO DO
        strand.deactivate();
    }
    else {

        let spawned = false;
        let combined = false

        let close = lf.query(strand);

        let membrane = null;
        close.forEach((itm) => {
            let sums = groupObj(strand.dynamic["codes"],["eee"]);
            if (itm.ops.name == "brane" && membrane == null) {
                membrane = itm;
            }
            if (itm.ops.type == "snip") {
                if ((itm.ops.name == "snp-go" &&
                    !strand.dynamic["codes"].includes(itm.dynamic["code"]) && 
                    itm.dynamic["code"].indexOf("d") != 0) ||
                    (itm.ops.name == "snp-ex" && (!("eee" in sums) || sums["eee"] <= 2)))
                {
                    strand.dynamic["codes"].push(itm.dynamic["code"]);
                    strand.pos.vel += itm.pos.vel;
                    strand.pos.dir += itm.pos.dir;
                    itm.deactivate();
                }
            }
            else if (itm.ops.type == "strand") {
                let nCodes = [];

                let codeLen = strand.dynamic["codes"].length + itm.dynamic["codes"].length;
                let canComb = false;
                let sumB = groupObj(itm.dynamic["codes"],["eee"]);
                let sumE = sums["eee"] + sumB["eee"];
                if (sumE / codeLen <= 0.25 && codeLen <= 48) { 
                    canComb = true;
                    nCodes = itm.dynamic["codes"];
                }

                if (canComb) {
                    strand.dynamic["codes"].push(...nCodes);
                    strand.pos.vel += itm.pos.vel;
                    strand.pos.dir += itm.pos.dir;
                    itm.deactivate();
                    combined = true;
                    let dspCode = strand.dynamic["codes"].join(":");
                    let cLen = strand.dynamic["codes"].length;
                    console.log("s " + strand.id + " combined : " + dspCode + " [" + cLen + "]");
                    for (let sz = 6; sz <= 18; sz+=4) {
                        strand.obj.classList.remove("sz-" + sz);
                        if (cLen >= sz) strand.obj.classList.add("sz-" + sz);
                    }
                }
            }
        });

        let cStrP = strand.dynamic["codes"].join(":");
        strand.obj.setAttribute("code",cStrP);
        if (strand.dynamic["codes"].length >= lf.minStrandLen && membrane != null) {

            let ptDyn = {
                gen: lf.step,
                struct: [ "complex" ],
                genetic: strand.dynamic["genetic"],
                codes: strand.dynamic["codes"]
            };

            let nVel = Math.floor(Math.random() * 360);
            let nDir = Math.floor(Math.random() * 9);
            let nPro= new LItem(new LVector(strand.pos.x, strand.pos.y,nDir,nVel),protoOps, ptDyn);
            lf.queueItem(nPro);

            membrane.deactivate();
            strand.deactivate();
            spawned = true;
            console.log("s " + strand.id + " spawned");
        }

        if (!spawned) {
            strand.dynamic["codes"].forEach((cd) => {
                lf.behaviors.run(strand, cd);
            });
        }
    }

    if (strand.active) {
        strand.pos.move(strand.ops.weight);
        strand.obj.style.left = strand.pos.x + "px";
        strand.obj.style.top = strand.pos.y + "px";
        strand.obj.style.rotate = "z " + strand.pos.dir + "deg";

        lf.encode(strand,'u');
    }
    else {
        strand.obj.style.display = "none";
    }
}