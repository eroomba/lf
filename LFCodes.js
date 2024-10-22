let blkCount = 3;
let replCount = 6;

function LFCodedBehaviors() {
    let me = this;
    me.validOrts = ["a","b","c","d"];
    me.gens = {
        "reset": function(item) {
            if ("perception" in item.genetic) item.genetic["perception"]["ran"] = false; 
            if ("seek" in item.genetic) { item.genetic["seek"]["target"] = null;  item.genetic["seek"]["ran"] = false; }
        },
        "aaa": function(item) {
            // enable movement - see "bbb"
            if (!("speed" in item.genetic)) {
                item.genetic["speed"] = Math.floor(Math.random() * 9) + 5;
                item.obj.classList.add("mover");
                let tail = item.obj.querySelector(".back");
                if (tail != undefined) {
                    let tailCont = "<div class=\"tail mv-tail mv-animation\">&sim;</div>";
                    tail.innerHTML = tailCont;
                }
            }
        },
        "aab": function(item) {
            // enable respiration 1 - see "aad"
            if (!("respiration" in item.genetic)) {
                item.genetic["respiration"] = ["spekG1","spekG2"];
                item.obj.classList.add("breather");
                let mid = item.obj.querySelector(".main");
                if (mid != undefined) {
                    let midCont = mid.innerHTML;
                    midCont += "&Colon;";
                    mid.innerHTML = midCont;
                }
            }
        },
        "aac": function(item) {
            // enable respiration 2 - see "aad"
            if (!("respiration" in item.genetic)) {
                item.genetic["respiration"] = ["spekG2","spekG1"];
                item.obj.classList.add("breather");
                let mid = item.obj.querySelector(".main");
                if (mid != undefined) {
                    let midCont = mid.innerHTML;
                    if (midCont == "&horbar;") midCont = "&Colon;";
                    else midCont += "&Colon;";
                    mid.innerHTML = midCont;
                }
            }
        },
        "aad": function(item) {
            // respirate - enable see "aab"
            if (item.complex >= 1) {
                if ("respiration" in item.genetic && Array.isArray(item.genetic["respiration"])) {
                    let resp = item.genetic["respiration"];

                    let spks = lf.query(item,"spek");

                    let r1 = [];
                    spks.forEach((sp) => {
                        if (sp.core.subtype == resp[0] && r1.length <= 2) r1.push(sp);
                    });

                    if (r1.length > 0) {
                        let count = r1.length;
                        r1.forEach((r) => { r.deactivate(); });
                        for (let r2 = 0; r2 < count; r2++) {
                            let nDir =  Math.floor(Math.random() * 360);
                            let nVel = Math.floor(Math.random() * 6) + 3;
                            let nSp = new LItem(new LVector(item.pos.x, item.pos.y, nDir, nVel), lfd.spek[resp[1]], { gen: lf.step });
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
            if (item.complex >= 1) {
                if ("speed" in item.genetic) {

                    let iSpeed = item.genetic["speed"];
                    if (item.complex == 1) iSpeed *= 0.5;

                    let mvSet = false;
                    if ("seek" in item.genetic) { 
                        if (!item.genetic["seek"]["ran"]) this["cbd"](item);
                        if (item.genetic["seek"]["target"] != null) {
                            let target = item.genetic["seek"]["target"];
                            let des = target.pos.subtract(item.pos);
                            item.pos.dir = des.dir;
                            if (item.complex >= 2 || (item.complex >= 1 && item.pos.vel <= 0.9)) {
                                item.pos.vel = iSpeed;
                                if (des.magnitude() < iSpeed) item.pos.vel = des.magnitude();
                            }
                            mvSet = true;
                        }
                    }
                    
                    if (!mvSet) {
                        if (item.complex >= 2 || (item.complex >= 1 && item.pos.vel <= 0.9)) {
                            item.pos.dir += 10 - Math.floor(Math.random() * 21);
                            item.pos.vel = iSpeed; 
                        }
                    } 

                    item.obj.setAttribute("dir", item.pos.dir);
                    item.obj.setAttribute("speed", item.genetic["speed"]);

                    item.pos.move(0);
                    //console.log(item.id + " moved!");
                }
            }
        },
        "bba": function(item) {
            // enable digestion 1 - see "bbc"
            if (!("digestion" in item.genetic)) {
                let dOps = {
                    "snipEx": Math.floor(Math.random() * 5) + 5,
                    "struckSeed": Math.floor(Math.random() * 15) + 5
                };
                item.genetic["digestion"] = {
                    weights: dOps,
                    count: 0,
                    gut: []
                };

                item.obj.classList.add("eater");
                let mouth = item.obj.querySelector(".front");
                if (mouth != undefined) {
                    let mouthCont = "<div class=\"mouth\"><span class=\"open\">&sum;</span><span class=\"closed\">O</span><div>";
                    mouth.innerHTML = mouthCont;
                }
            }
        },
        "bbc": function(item) {
            // digestion - enable see "bba"
            if (item.complex >= 2) {           
                if ("digestion" in item.genetic) {
                    let gCount = item.genetic["digestion"]["count"];
                    let digGut = item.genetic["digestion"]["gut"];
                    let isDig = digGut.length > 0 ? true : false;
                    let dWeights = item.genetic["digestion"]["weights"];
                    if (gCount > 0) {
                        item.genetic["digestion"]["count"]--;
                        item.life++;
                    }
                    else {
                        if (isDig) {
                            switch (digGut[0].type) {
                                case "snip":
                                    lfd.snip.decay(digGut[0].subtype, digGut[0].code, item.pos);
                                    break;
                                case "struck":
                                    lfd.struck.decay(digGut[0].subtype, item.pos);
                                    break;
                            }
                            let addV = dWeights[digGut[0].subtype];
                            item.life = item.life + addV > 100 ? 100 : item.life + addV;
                            item.genetic["digestion"]["gut"] = [];
                            item.obj.classList.remove("eating");
                        }
                        else {
                            let qR = item.ops.range / 2;
                            let fd = lf.query(item, null, { range: qR });

                            fd.forEach((fItem) => {
                                if (fItem.core.subtype in dWeights && digGut.length == 0) {
                                    let des = fItem.pos.subtract(item.pos);

                                    if (Math.abs(des.dir) < 30 || des.magnitude() < item.ops.range / 2) {
                                        item.genetic["digestion"]["count"] = item.genetic["digestion"]["weights"][fItem.core.subtype];
                                        let fCode = "";
                                        if (fItem.core.type == "snip") fCode = fItem.dynamic["code"];
                                        item.genetic["digestion"]["gut"].push({type:fItem.core.type,subtype:fItem.core.subtype,code:fCode});
                                        item.life++;
                                        fItem.deactivate();
                                        item.obj.classList.add("eating");
                                    }
                                }
                            });
                        }
                    }
                }
            }
        },
        "bab": function(item) {
            // enable chem - see "bac"
            if (!("chem" in item.genetic)) {
                item.genetic["chem"] = 0;
                item.obj.classList.add("chem");
                let mid = item.obj.querySelector(".main");
                if (mid != undefined) {
                    let midCont = mid.innerHTML;
                    if (midCont == "&horbar;") midCont = "&divonx;";
                    else midCont += "&divonx;";
                    mid.innerHTML = midCont;
                }
            }
        },
        "bac": function(item) {
            // chem - enable see "bab"
            if (item.complex >= 2) {
                if ("chem" in item.genetic) {
                    
                    let g2s = lf.query(item,"spek");

                    g2s.forEach((g2) => {
                        if (g2.core.subtype == "spekG3" && item.genetic["chem"] < 2) {
                            item.genetic["chem"]++;
                            g2.deactivate();
                        }
                    });

                    if (item.genetic["chem"] == 2) {
                        let nDir = Math.floor(Math.random() * 360);
                        let nVel = Math.floor(Math.random() * 10) + 5;
                        let nG1 = new LItem(new LVector(item.pos.x, item.pos.y, nDir, nVel), lfd.spek["spekX"], { gen: lf.step });

                        item.genetic["chem"] = 0;
                        item.life = item.life + 10 > 100 ? 100 : item.life + 10;
                        console.log("chemed!!");
                    }
                }
            }
        },
        "cba": function(item) {
            // enable perception - see "cbb"
            if (item.complex >= 2) {
                if (!("perception" in item.genetic)) {
                    item.genetic["perception"] = { ran: false, range: (Math.floor(Math.random() * 4) + 2) * item.ops.range, found: new Array() };
                    //console.log("perception: " + item.genetic["perception"]["range"]);
                }
            }
        },
        "cbb": function(item) {
            // perception - enable see "cba"
            if (item.complex >= 2) {
                if ("perception" in item.genetic && !item.genetic["perception"].ran) {
                    let pRange = item.genetic["perception"]["range"];

                    item.genetic["perception"]["found"] = lf.query(item, null, { range: pRange });
                    //item.genetic["perception"]["found"].forEach((it) => {it.obj.style.color = "orange"; });
                    item.genetic["perception"]["ran"] = true;
                }
            }
        },
        "cbc": function(item) {
            // enable seek - see "cbd"
            if (!("seek" in item.genetic)) item.genetic["seek"] = { target: null, ran: false };
        },
        "cbd": function(item) {
            // seek - enable see "cbc"
            if (item.complex >= 2) {
                if ("seek" in item.genetic && "perception" in item.genetic) {
                    if (!item.genetic["perception"]["ran"]) { this["cbb"](item); }
                    let minD = null;
                    item.genetic["perception"]["found"].forEach((sk) => {
                        if ("digestion" in item.genetic && item.genetic["digestion"]["count"] == 0) {
                            if (sk.core.subtype in item.genetic["digestion"]["weights"]) {
                                let dD = Math.hypot(item.pos.x - sk.pos.x, item.pos.y - sk.pos.y);
                                if (item.genetic["seek"]["target"] == null) { minD = dD; item.genetic["seek"]["target"] = sk; }
                                else if (dD < minD) { minD = dD; item.genetic["seek"]["target"] = sk; }
                            }
                        }
                        if ("chem" in item.genetic && item.genetic["chem"] < 2) {
                            if (sk.core.subtype == "spekG3") {
                                let dD = Math.hypot(item.pos.x - sk.pos.x, item.pos.y - sk.pos.y);
                                if (item.genetic["seek"]["target"] == null) { minD = dD; item.genetic["seek"]["target"] = sk; }
                                else if (dD < minD) { minD = dD; item.genetic["seek"]["target"] = sk; }
                            }
                        }
                        if ("respiration" in item.genetic) {
                            if (sk.core.subtype == item.genetic["respiration"][0]) {
                                let dD = Math.hypot(item.pos.x - sk.pos.x, item.pos.y - sk.pos.y);
                                if (item.genetic["seek"]["target"] == null) { minD = dD; item.genetic["seek"]["target"] = sk; }
                                else if (dD < minD) { minD = dD; item.genetic["seek"]["target"] = sk; }
                            }
                        }
                    });
                    //if (item.genetic["seek"]["target"] != null) {
                        //item.genetic["seek"]["target"].obj.style.color = "red";
                        //console.log("Seeking " + item.genetic["seek"]["target"].id);
                    //}
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
            if (item.complex >= 1) {
                if (!("storage" in item.genetic)) {
                    item.genetic["storage"] = { "max": Math.floor(Math.random() * 20) + 10 };
                    item.dynamic["storage"] = { "snipBlk": 0, "snipEx": 0 };
                    Object.keys(ldf.ort).forEach((ky) => {
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
            if (item.core.type == "snip") {
                let oths = lf.query(item, null, { range: item.core.range * 2 });

                oths.forEach((oth) => {

                    if (oth.core.type == "strand") {

                        let snps = lf.query(oth, "snip");
        
                        let blks = [];
                        snps.forEach((snp) => {
                            if (snp.core.subtype == "snipBlk" && blks.length <= 2) blks.push(snp);
                        });
        
                        if (blks.length == replCount) {
                            blks.forEach((blk) => { blk.deactivate(); });
                            let nDir = Math.floor(Math.random() * 360);
                            let nDir2 = nDir - 180;
                            let nVel = Math.floor(Math.random() * 10) + 5;

                            let nStrand = new LItem(new LVector(oth.pos.x, oth.pos.y, nDir, nVel), ldf.strand.strand, { gen: lf.step, codes: oth.dynamic["codes"].slice(), genetic: JSON.parse(JSON.stringify(oth.genetic)) });
                            oth.pos.dir = nDir2;
                            oth.pos.vel = nVel;
                            lf.queueItem(nStrand);
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
                if (parts[p].core.type == "ort" && parts[p].core.data == "p" && item.dynamic["parts"]["p"] < 3) {
                    item.dynamic["parts"]["p"]++;
                    parts[p].deactivate();
                }
            }
            if (item.dynamic["parts"]["p"] == 3) {
                let snipVal = "ppp";
                parts.forEach((pt) => { pt.deactivate(); });
                let nDir = Math.floor(Math.random() * 360);
                let nVel = Math.floor(Math.random() * 10) + 5;
                let nsnip = new LItem(new LVector(item.pos.x, item.pos.y, nDir, nVel), ldf.snip.snipBlk, { gen: lf.step, code: snipVal, len: snipVal.length });
                lf.queueItem(nsnip);
                item.dynamic["parts"]["p"] = 0;
                if (item.complex == 0) item.obj.innerHTML = "&int;";
            }
            else if (item.complex == 0 && item.dynamic["parts"]["p"] == 2) item.obj.innerHTML = "<i class=\"loaded\">&cwconint;</i>"; // int with circle
            else if (item.complex == 0 && item.dynamic["parts"]["p"] == 1) item.obj.innerHTML = "<i class=\"loaded\">&cwint;</i>"; // int with slash
            else if (item.complex == 0) item.obj.innerHTML = "&int;";
        }
    };
    me.run = (item,code) => {
        if (code in me.gens)
            return me.gens[code](item);
        else
            return null;
    };
    me.singles = [
        "e--",
        "ppp",
        "ddd",
        "daa",
        "dab",
        "dac",
        "dad",
        "dba",
        "dbb",
        "dbc",
        "dbd",
        "dca",
        "dcc",
        "dcd"
    ];

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