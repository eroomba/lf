let blkCount = 3;
let replCount = 6;

function codedBehaviors() {
    let me = this;
    me.validOrts = ["a","b","c","d"];
    me.gens = {
        "aaa": function(item) {
            // enable movement - see "bbb"
            if (!("speed" in item.genetic)) {
                item.genetic["speed"] = Math.floor(Math.random() * 9) + 5;
            }
        },
        "aab": function(item) {
            // enable respiration 1 - see "aad"
            if (!("respiration" in item.genetic)) item.genetic["respiration"] = ["spk-g1","spk-g2"];
        },
        "aac": function(item) {
            // enable respiration 2 - see "aad"
            if (!("respiration" in item.genetic)) item.genetic["respiration"] = ["spk-g2","spk-g1"];
        },
        "aad": function(item) {
            // respirate - enable see "aab"
            if ("struct" in item.dynamic && item.dynamic["struct"].includes("complex")) {
                if ("respiration" in item.genetic && Array.isArray(item.genetic["respiration"])) {
                    let resp = item.genetic["respiration"];

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
                if ("speed" in item.genetic) {
                    let iSpeed = item.genetic["speed"];
                    item.pos.dir += 10 - Math.floor(Math.random() * 21);

                    item.pos.vel = iSpeed;  

                    item.obj.setAttribute("dir", item.pos.dir);
                    item.obj.setAttribute("speed", item.genetic["speed"]);

                    item.pos.move(0);

                    console.log(item.id + " moved!");
                }
            }
        },
        "bba": function(item) {
            // enable digestion 1 - see "bbc"
            let dOps = ["snp-blk","snp-ex"];
            if (!("digestion" in item.genetic)) item.genetic["digestion"] = dOps[Math.floor(Math.random() * dOps.length)];
        },
        "bbc": function(item) {
            // digestion - enable see "bba"
            if ("struct" in item.dynamic && item.dynamic["struct"].includes("complex")) {
                if ("digestion" in item.genetic) {
                    let dID = item.genetic["digestion"];

                    // TODO
                }
            }
        },
        "bab": function(item) {
            // enable chem - see "bac"
            if (!("chem" in item.genetic)) item.genetic["chem"] = 0;
        },
        "bac": function(item) {
            // chem - enable see "bac"
            if ("struct" in item.dynamic && item.dynamic["struct"].includes("complex")) {
                if ("chem" in item.genetic) {
                    
                    let g2s = lf.query(item,"spek");

                    g2s.forEach((g2) => {
                        if (g2.ops.name == "spk-g3" && item.genetic["chem"] < 2) {
                            item.genetic["chem"]++;
                            g2.deactivate();
                        }
                    });

                    if (item.genetic["chem"] == 2) {
                        let nDir = Math.floor(Math.random() * 360);
                        let nVel = Math.floor(Math.random() * 10) + 5;
                        let nG1 = new LItem(new LVector(item.pos.x, item.pos.y, nDir, nVel), spekOps["spk-x"], { gen: lf.step });

                        item.genetic["chem"] = 0;
                        item.life = item.life + 10 > 100 ? 100 : item.life + 10;
                        console.log("chemed!!");
                    }
                }
            }
        },
        "ccc": function(item) {
            // build blks and store
            if (item.type == "strand") {
                // TODO
            }
        },
        "cab": function(item) {
            // enable storage - see "cad"
            if ("struct" in item.dynamic && item.dynamic["struct"].includes("complex")) {
                if (!("storage" in item.genetic)) {
                    item.genetic["storage"] = { "max": Math.floor(Math.random() * 20) + 10 };
                    item.dynamic["storage"] = { "snp-blk": 0, "snp-ex": 0 };
                    Object.keys(ortOps).forEach((ky) => {
                        item.dynamic["storage"][ky] = 0;
                    });
                }
            }
        },
        "cad": function(item) {
            // use storage - enable see "cab"
            if ("storage" in item.genetic) {
                let maxS = item.genetic["storage"];

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

                            let nStrand = new LItem(new LVector(oth.pos.x, oth.pos.y, nDir, nVel), strandOps, { gen: lf.step, codes: oth.dynamic["codes"].slice(), genetic: JSON.parse(JSON.stringify(oth.genetic)) });
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
            me.gens["buildBlock"](item);
        },
        "buildBlock": function(item) {
            let parts = lf.query(item);
            if (!("parts" in item.dynamic)) item.dynamic["parts"] = { "p":0 };
            for (let p = 0; p < parts.length; p++) {
                if (parts[p].ops.type == "ort" && parts[p].ops.data == "p" && item.dynamic["parts"]["p"] < 3) {
                    item.dynamic["parts"]["p"]++;
                    parts[p].deactivate();
                }
            }
            if (item.dynamic["parts"]["p"] == 3) {
                let snipVal = "ppp";
                parts.forEach((pt) => { pt.deactivate(); });
                let nDir = Math.floor(Math.random() * 360);
                let nVel = Math.floor(Math.random() * 10) + 5;
                let nsnip = new LItem(new LVector(item.pos.x, item.pos.y, nDir, nVel), snipOps["snp-blk"], { gen: lf.step, code: snipVal, len: snipVal.length });
                lf.queueItem(nsnip);
                item.dynamic["parts"]["p"] = 0;
                item.obj.innerHTML = "&int;";
            }
            else if (item.dynamic["parts"]["p"] == 2) item.obj.innerHTML = "<i class=\"loaded\">&cwconint;</i>"; // int with circle
            else if (item.dynamic["parts"]["p"] == 1) item.obj.innerHTML = "<i class=\"loaded\">&cwint;</i>"; // int with slash
            else item.obj.innerHTML = "&int;";
        }
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
    me.gens["dba"] = me.gens["daa"];
    me.gens["dbb"] = me.gens["daa"];
    me.gens["dbc"] = me.gens["daa"];
    me.gens["dbd"] = me.gens["daa"];
    me.gens["dca"] = me.gens["daa"];
    me.gens["dcb"] = me.gens["daa"];
    me.gens["dcc"] = me.gens["daa"];
    me.gens["dcd"] = me.gens["daa"];
}