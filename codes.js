let blkCount = 3;
let replCount = 6;

function codedBehaviors() {
    let me = this;
    me.validOrts = ["a","b","c","d"];
    me.gens = {
        "aaa": function(item) {
            // enable movement - see "bbb"
            if ("genetic" in item.dynamic && !("speed" in item.dynamic["genetic"])) {
                item.dynamic["genetic"]["speed"] = Math.floor(Math.random() * 9) + 5;
            }
        },
        "aab": function(item) {
            // enable respiration 1 - see "aad"
            if ("genetic" in item.dynamic && !("respiration" in item.dynamic["genetic"])) item.dynamic["genetic"]["respiration"] = ["spk-g1","spk-g2"];
        },
        "aac": function(item) {
            // enable respiration 2 - see "aad"
            if ("genetic" in item.dynamic && !("respiration" in item.dynamic["genetic"])) item.dynamic["genetic"]["respiration"] = ["spk-g2","spk-g1"];
        },
        "aad": function(item) {
            // respirate - enable see "aab"
            if ("struct" in item.dynamic && item.dynamic["struct"].includes("complex")) {
                if ("genetic" in item.dynamic && Array.isArray(item.dynamic["genetic"]["respiration"])) {
                    let resp = item.dynamic["genetic"]["respiration"];

                    let spks = lf.query(item,"spek");

                    let r1 = [];
                    spks.forEach((sp) => {
                        if (sp.ops.name == resp[0] && r1.length <= 2) r1.push(sp);
                    });

                    if (r1.length > 0) {
                        let count = r1.length;
                        r1.forEach((r) => { r.deactivate(); });
                        for (let r2 = 0; r2 < count; r2++) {
                            let nDir =  Math.floor(Math.random() * 360);
                            let nVel = Math.floor(Math.random() * 6) + 3;
                            let nSp = new LItem(new LVector(item.pos.x, item.pos.y, nDir, nVel), spekOps[resp[1]], { gen: lf.step });
                            lf.queueItem(nSp);
                            let lifeAdd = 1;
                            if (resp[0] == "spk-g2") lifeAdd = 2;
                            item.life = item.life + lifeAdd > 100 ? 100 : item.life + lifeAdd;
                            console.log(item.id + " breathed!");
                        } 
                    }

                }
            }
        },
        "bbb": function(item) {
            // movement - enable see "aaa"
            if ("struct" in item.dynamic && item.dynamic["struct"].includes("complex")) {
                if ("genetic" in item.dynamic && "speed" in item.dynamic["genetic"]) {
                    let iSpeed = item.dynamic["genetic"]["speed"];
                    item.pos.dir += 10 - Math.floor(Math.random() * 21);

                    item.pos.vel = iSpeed;  

                    item.obj.setAttribute("dir", item.pos.dir);
                    item.obj.setAttribute("speed", item.dynamic["genetic"]["speed"]);

                    item.pos.move(0);

                    console.log(item.id + " moved!");
                }
            }
        },
        "bba": function(item) {
            // enable digestion 1 - see "bbc"
            let dOps = ["snp-blk","snp-ex"]
            if ("genetic" in item.dynamic && !("digestion" in item.dynamic["genetic"])) item.dynamic["genetic"]["digestion"] = dOps[Math.floor(Math.random() * dOps.length)];
        },
        "bbc": function(item) {
            // digestion - enable see "bba"
            if ("struct" in item.dynamic && item.dynamic["struct"].includes("complex")) {
                if ("genetic" in item.dynamic && "digestion" in item.dynamic["genetic"]) {
                    let dID = item.dynamic["genetic"]["digestion"];

                    let snps = lf.query(item,"snip");

                    let food = [];
                    snps.forEach((snp) => {
                        if (snp.ops.name == dID && food.length == 0) food.push(snp);
                    });

                    if (food.length > 0) {
                        food.forEach((fd) => {
                            fd.ops.dformula.forEach((di) => {
                                let nops = {};
                                switch (di.type) {
                                    case "spek":
                                        nops = spekOps[di.name];
                                        break;
                                    case "ort":
                                        nops = ortOps[di.name];
                                        break;
                                    case "snip":
                                        nops = snipOps[di.name];
                                        break;
                                }
                                let xDir = 1 - Math.floor(Math.random() * 10);
                                let yDir = 1 - Math.floor(Math.random() * 10);
                                let nDir =  Math.floor(Math.random() * 360);
                                let nVel = Math.floor(Math.random() * 10) + 5;
                                let ndobj = new LItem(new LVector(item.pos.x + xDir, item.pos.y + yDir, nDir, nVel), nops, {gen:lf.step});
                                lf.queueItem(ndobj);
                            });
                            fd.deactivate();
                        });
                        let lifeAdd = 10;
                        if (dID == "snp-blk") lifeAdd = 15;
                        item.life = item.life + lifeAdd > 100 ? 100 : item.life + lifeAdd;
                        console.log(item.id + " ate!");
                    }
                }
            }
        },
        "ccc": function(item) {
            // build blks
            if (item.type == "strand") {
                let parts = lf.query(item);
                if (!("ccc-parts" in item.dynamic)) item.dynamic["ccc-parts"] = {"p":0,"x":0};
                for (let p = 0; p < parts.length; p++) {
                    if (parts[p].ops.type == "ort" && parts[p].ops.data == "p" && item.dynamic["ccc-parts"]["p"] < 2) {
                        item.dynamic["ccc-parts"]["p"]++;
                        parts[p].deactivate();
                    }
                    else if (parts[p].ops.type == "spek" && 
                            (parts[p].ops.data == spekOps["spk-x1"].data || parts[p].ops.data == spekOps["spk-x2"].data || parts[p].ops.data == -1) && 
                            item.dynamic["ccc-parts"]["x"] == 0) {
                        item.dynamic["ccc-parts"]["x"]++;
                        parts[p].deactivate();
                    }
                }
                if (item.dynamic["ccc-parts"]["p"] == 2 && item.dynamic["ccc-parts"]["x"] == 1) {
                    let snipVal = "ppp";
                    parts.forEach((pt) => { pt.deactivate(); });
                    let nDir = Math.floor(Math.random() * 360);
                    let nVel = Math.floor(Math.random() * 10) + 5;
                    let nsnip = new LItem(new LVector(item.pos.x, item.pos.y, nDir, nVel), snipOps["snp-blk"], { gen: lf.step, code: snipVal, len: snipVal.length });
                    lf.queueItem(nsnip);
                    item.dynamic["ccc-parts"]["p"] = 0;
                    item.dynamic["ccc-parts"]["x"] = 0;
                }
            }
        },
        "cab": function(item) {
            // enable storage - see "cad"
            if ("struct" in item.dynamic && item.dynamic["struct"].includes("complex")) {
                if ("genetic" in item.dynamic && !("storage" in item.dynamic["genetic"])) {
                    item.dynamic["genetic"]["storage"] = { "max": Math.floor(Math.random() * 20) + 10 };
                    item.dynamic["storage"] = { "snp-blk": 0, "snp-ex": 0 };
                    Object.keys(ortOps).forEach((ky) => {
                        item.dynamic["storage"][ky] = 0;
                    });
                }
            }
        },
        "cad": function(item) {
            // use storage - enable see "cab"
            if ("genetic" in item.dynamic && "storage" in item.dynamic["genetic"]) {
                let maxS = item.dynamic["genetic"]["storage"];

            }
        },
        // code starting with d does not combine into strands
        "ddd": function(item) {
            // trigger replication
            if (item.ops.type == "snip") {
                let oths = lf.query(item, null, { range: item.ops.range * 2 });

                oths.forEach((oth) => {

                    if (oth.ops.type == "strand") {

                        let snps = lf.query(oth, "snip");
        
                        let blks = [];
                        snps.forEach((snp) => {
                            if (snp.ops.name == "snp-blk" && blks.length <= 2) blks.push(snp);
                        });
        
                        if (blks.length == replCount) {
                            blks.forEach((blk) => { blk.deactivate(); });
                            let nDir = Math.floor(Math.random() * 360);
                            let nDir2 = nDir - 180;
                            let nVel = Math.floor(Math.random() * 10) + 5;

                            let nStrand = new LItem(new LVector(oth.pos.x, oth.pos.y, nDir, nVel), strandOps, { gen: lf.step, codes: oth.dynamic["codes"].slice(), genetic: JSON.parse(JSON.stringify(oth.dynamic["genetic"])) });
                            oth.pos.dir = nDir2;
                            oth.pos.vel = nVel;
                            lf.queueItem(nStrand);
                            console.log("repl-st");
                        }
                    }
                });
            }
        },
        "daa": function(item) {
            // build blks
            let parts = lf.query(item);
            let spekName = "";
            if (!("parts" in item.dynamic)) item.dynamic["parts"] = {"p":0,"x":0};
            for (let p = 0; p < parts.length; p++) {
                if (parts[p].ops.type == "ort" && parts[p].ops.data == "p" && item.dynamic["parts"]["p"] < 2) {
                    item.dynamic["parts"]["p"]++;
                    parts[p].deactivate();
                }
                else if (parts[p].ops.type == "spek" && parts[p].ops.data == spekOps["spk-x1"].data && item.dynamic["parts"]["x"] == 0) {
                    spkName = parts[p].ops.name;
                    item.dynamic["parts"]["x"]++;
                    parts[p].deactivate();
                }
            }
            if (item.dynamic["parts"]["p"] == 2 && item.dynamic["parts"]["x"] == 1) {
                let snipVal = "ppp";
                parts.forEach((pt) => { pt.deactivate(); });
                let nDir = Math.floor(Math.random() * 360);
                let nVel = Math.floor(Math.random() * 10) + 5;
                let nsnip = new LItem(new LVector(item.pos.x, item.pos.y, nDir, nVel), snipOps["snp-blk"], { gen: lf.step, code: snipVal, len: snipVal.length, spkName: spkName });
                lf.queueItem(nsnip);
                item.dynamic["parts"]["p"] = 0;
                item.dynamic["parts"]["x"] = 0;
                item.obj.innerHTML = "&int;";
            }
            else if (item.dynamic["parts"]["p"] == 1 && item.dynamic["parts"]["x"] == 1) item.obj.innerHTML = "<i class=\"loaded\">&awconint;</i>"; // int with slash and dash
            else if (item.dynamic["parts"]["p"] == 2 && item.dynamic["parts"]["x"] == 0) item.obj.innerHTML = "<i class=\"loaded\">&cwconint;</i>"; // int with circle
            else if (item.dynamic["parts"]["p"] == 0 && item.dynamic["parts"]["x"] == 1) item.obj.innerHTML = "<i class=\"loaded\">&cwint;</i>"; // int with slash
            else item.obj.innerHTML = "&int;";
        },
        "dbb": function(item) {
            // build blks
            let parts = lf.query(item);
            let spekName = "";
            if (!("parts" in item.dynamic)) item.dynamic["parts"] = {"p":0,"x":0};
            for (let p = 0; p < parts.length; p++) {
                if (parts[p].ops.type == "ort" && parts[p].ops.data == "p" && item.dynamic["parts"]["p"] < 2) {
                    item.dynamic["parts"]["p"]++;
                    parts[p].deactivate();
                }
                else if (parts[p].ops.type == "spek" && parts[p].ops.data == spekOps["spk-x2"].data && item.dynamic["parts"]["x"] == 0) {
                    spkName = parts[p].ops.name;
                    item.dynamic["parts"]["x"]++;
                    parts[p].deactivate();
                }
            }
            if (item.dynamic["parts"]["p"] == 2 && item.dynamic["parts"]["x"] == 1) {
                let snipVal = "ppp";
                parts.forEach((pt) => { pt.deactivate(); });
                let nDir = Math.floor(Math.random() * 360);
                let nVel = Math.floor(Math.random() * 10) + 5;
                let nsnip = new LItem(new LVector(item.pos.x, item.pos.y, nDir, nVel), snipOps["snp-blk"], { gen: lf.step, code: snipVal, len: snipVal.length, spkName: spkName });
                lf.queueItem(nsnip);
                item.dynamic["parts"]["p"] = 0;
                item.dynamic["parts"]["x"] = 0;
            }
            else if (item.dynamic["parts"]["p"] == 1 && item.dynamic["parts"]["x"] == 1) item.obj.innerHTML = "<i class=\"loaded\">&awconint;</i>"; // int with slash and dash
            else if (item.dynamic["parts"]["p"] == 2 && item.dynamic["parts"]["x"] == 0) item.obj.innerHTML = "<i class=\"loaded\">&cwconint;</i>"; // int with circle
            else if (item.dynamic["parts"]["p"] == 0 && item.dynamic["parts"]["x"] == 1) item.obj.innerHTML = "<i class=\"loaded\">&cwint;</i>"; // int with slash
            else item.obj.innerHTML = "&int;";
        },
        "dcc": function(item) {
            // build blks
            let parts = lf.query(item);
            let spekName = "";
            if (!("parts" in item.dynamic)) item.dynamic["parts"] = {"p":0,"x":0};
            for (let p = 0; p < parts.length; p++) {
                if (parts[p].ops.type == "ort" && parts[p].ops.data == "p" && item.dynamic["parts"]["p"] < 2) {
                    item.dynamic["parts"]["p"]++;
                    parts[p].deactivate();
                }
                else if (parts[p].ops.type == "spek" && parts[p].ops.data == -1 && item.dynamic["parts"]["x"] == 0) {
                    spkName = parts[p].ops.name;
                    item.dynamic["parts"]["x"]++;
                    parts[p].deactivate();
                }
            }
            if (item.dynamic["parts"]["p"] == 2 && item.dynamic["parts"]["x"] == 1) {
                let snipVal = "ppp";
                parts.forEach((pt) => { pt.deactivate(); });
                let nDir = Math.floor(Math.random() * 360);
                let nVel = Math.floor(Math.random() * 10) + 5;
                let nsnip = new LItem(new LVector(item.pos.x, item.pos.y, nDir, nVel), snipOps["snp-blk"], { gen: lf.step, code: snipVal, len: snipVal.length, spkName: spkName });
                lf.queueItem(nsnip);
                item.dynamic["parts"]["p"] = 0;
                item.dynamic["parts"]["x"] = 0;
            }
            else if (item.dynamic["parts"]["p"] == 1 && item.dynamic["parts"]["x"] == 1) item.obj.innerHTML = "<i class=\"loaded\">&awconint;</i>"; // int with slash and dash
            else if (item.dynamic["parts"]["p"] == 2 && item.dynamic["parts"]["x"] == 0) item.obj.innerHTML = "<i class=\"loaded\">&cwconint;</i>"; // int with circle
            else if (item.dynamic["parts"]["p"] == 0 && item.dynamic["parts"]["x"] == 1) item.obj.innerHTML = "<i class=\"loaded\">&cwint;</i>"; // int with slash
            else item.obj.innerHTML = "&int;";
        },
    };
    me.run = (item,code) => {
        if (code in me.gens)
            return me.gens[code](item);
        else
            return null;
    }

    me.gens["dab"] = me.gens["daa"];
    me.gens["dac"] = me.gens["daa"];
    me.gens["dad"] = me.gens["daa"];
    me.gens["dba"] = me.gens["dbb"];
    me.gens["dbc"] = me.gens["dbb"];
    me.gens["dbd"] = me.gens["dbb"];
    me.gens["dca"] = me.gens["dcc"];
    me.gens["dcb"] = me.gens["dcc"];
    me.gens["dcd"] = me.gens["dcc"];
}