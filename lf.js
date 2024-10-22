let lf;
let mousePosX = 0;
let mousePosY = 0;

const defaultOps = { name: "empty", type: "none", weight: 10, data: null, content: "X", formula: () => { return null;}, range: 0, decay: 0, dformula: [] };

let gVars = {
    braneCount: 3,
    seedCount: 3,
    spekColl: false,
    minStrandLen: 14,
    maxItems: 5000
}

function LF(ldObj = null) {
    let me = this;
    me.ttLen = 3;
    me.step = ldObj != null ? ldObj.step : 0;
    me.obj = document.getElementById("main"); 
    me.consoleset = {
        status: document.getElementById("statusDisp"),
        statusIcon: document.getElementById("statusIcon"),
        out: document.getElementById("outDisp")
    };
    me.w = window.innerWidth;
    me.h = window.innerHeight;
    me.idc = 0;
    me.initMode = "chaos";
    //me.initMode = "t-puff";
    //me.initMode = "r-puff";
    //me.initMode = "mv-test";
    //me.initMode = "sta-puff";
    //me.initMode = "brane-test";
    //me.initMode = "seed-test2";
    //me.initMode = "feed-test";
    //me.initMode = "cell-test";
    //me.initMode = "d-test";
    //me.initMode = "sd-test";
    //me.initMode = "complex-test";
    me.marker = {
        obj: document.getElementById("marker"),
        track: null
    };
    me.chaosOps = {
        dripRate: 0.4,
        puffRate: 0.5,
        bombRate: 0.8
    };
    me.shash = null;
    me.items = {};
    me.additems = [];
    me.extras = {};
    me.snipStats = {show:false};
    me.debugDisplay = false;
    me.events = [];
    me.behaviors = new codedBehaviors();
    me.shash = new SHash(me.w,me.h,50);
    me.sfhash = new SfHash(me.w,me.h,50);
    me.qtree = { i: new QuadTree(0,0,me.w,me.h,null,true), u: new QuadTree(0,0,me.w,me.h,null,true) };
    //me.tmode = ldObj != null ? ldObj.tmode : "qtree";
    me.tmode = ldObj != null ? ldObj.tmode : "sfhash";
    me.encode = (item, mode) => {
        if (me.tmode == "qtree") {
            if (mode == "u" || mode == "i") {
                me.qtree[mode].add(item);
            }
        }
        else if (me.tmode == "shash") {
            if (mode == "u") me.shash.prehash(item);
            else me.shash.hash(item);
        }
    };
    me.remEncode = (itemID) => {
        if (me.tmode == "qtree") {
            me.qtree["i"].remove(itemID);
            me.qtree["u"].remove(itemID);
        }
        else if (me.tmode == "shash") {
            if (itemID in me.items) {
                me.shash.remove(itemID, me.items[itemID].pos.x, me.items[itemID].pos.y);
            }
        }
        else if (me.tmode == "sfhash") {
            if (itemID in me.items) {
                me.sfhash.remove(itemID, me.items[itemID].pos.x, me.items[itemID].pos.y);
                me.items[itemID].pos.hash = "";
            }
        }
    };
    me.query = (item, type, qops = {}) => {
        if (item != undefined && item != null && item.pos != undefined && item.pos != null) {
            let qX = item.pos.x;
            let qY = item.pos.y;
            let qR = item.ops.range;
            if (qops != undefined && qops != null) {
                if ("x" in qops) qX = qops["x"];
                if ("y" in qops) qX = qops["y"];
                if ("range" in qops) qR = qops["range"];
            }
            if (me.tmode == "qtree") {
                return me.qtree["i"].queryC(item.id,qX,qY,qR,type);
            }
            else if (me.tmode == "shash") {
                return me.shash.query(item,type);
            }
            else {
                return me.sfhash.query(item,type,{ range: qR });
            }
        }
        return [];
    };
    me.stop = () => {
        clearTimeout(rt);
        running = false;
        lf.consoleset.statusIcon.style.color = "red";
        lf.consoleset.status.innerHTML = "stopped";
        console.log("stopped at step " + me.step);
    };
    me.roll = () => {
        if (me.tmode == "qtree") {
            me.qtree["i"] = me.qtree["u"];
            me.qtree["u"] = new QuadTree(0,0,me.w,me.h,null,true);
        }
        else if (me.tmode == "shash") me.shash.roll();
        else if (me.tmode == "sfhash") me.sfhash.roll(me.items);
    };
    me.refresh = () => {
        Object.keys(me.items).forEach((ky) => {
            if (!me.items[ky].active)
                me.removeItem(me.items[ky].id);
        });
    };
    me.generateID = () => {
        return "i-" + me.idc++ + "-" + Math.floor(Math.random() * 10000000);
    };
    me.addItem = (item) => {
        if (item.active && !(item.id in me.items)) {
            item.gen = me.step;
            me.items[item.id] = item;
            me.obj.append(item.obj);
            return true;
        }

        return false;
    };
    me.queueItem = (item) => {
        if (item.active) me.additems.push(item);
    };
    me.removeItem = (itemID) => {
        me.remEncode(itemID);
        let rmItem = document.getElementById(itemID);
        if (rmItem) rmItem.remove();
        if (itemID in me.items) {
            me.remEncode(itemID);
            delete me.items[itemID];
        }
    };
    me.bomb = (mX=null,mY=null) => {

        let validSpeks = [
            "spk-a1",
            "spk-a2",
            "spk-b1",
            "spk-b2",
            "spk-c1",
            "spk-c2",
            "spk-d1",
            "spk-d2",
            "spk-x",
            "spk-x"
        ];

        let r = Math.floor(Math.random() * 150) + 75;

        if (mX==null) {
            mX = Math.floor(Math.random() * (me.w - (r * 2))) + r;
        }

        if (mY==null) {
            mY = Math.floor(Math.random() * (me.h - (r * 2))) + r;
        }

        let addR = Math.floor(Math.random() * 15) + 5;
        for (let a = 0; a < 360; a+=addR) {
            let count = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < count; j++) {
                let r1 = Math.floor(Math.random() * r);
                let ix1 = Math.floor(Math.random() * validSpeks.length);
                let k1 = validSpeks[ix1];
                let nD = Math.floor(Math.random() * (r - 20)) + 20;
                let nX = mX + (nD * Math.cos(a * Math.PI / 180));
                let nY = mY + (nD * Math.sin(a * Math.PI / 180));
                let nDir = a;
                let nVel = Math.floor(Math.random() * 11) + 10;
                let nItem = new LItem(new LVector(nX, nY, nDir, nVel), spekOps[k1], {gen:me.step});
                if(me.addItem(nItem)) me.encode(nItem,'u');
            }
            addR += Math.floor(Math.random() * 15) + 5;
        }

        let bID = "bomb-" + me.step;

        if (!("bombs" in me.extras)) me.extras["bombs"] = [];
        me.extras["bombs"].push(
            new LXtra(new LVector(mX, mY, 0, 0), {
                width: r * 2,
                init: function(bomb) {
                    let nObj = document.createElement("div");
                    nObj.id = bID;
                    nObj.classList.add("xtra");
                    nObj.classList.add("bomb");
                    nObj.style.left = bomb.pos.x + "px";
                    nObj.style.top = bomb.pos.y + "px";
                    nObj.style.opacity = 1;
                    nObj.innerHTML = "&compfn;"; //"&there4;&because;"
                    me.obj.append(nObj);
                    bomb.obj = nObj;
                },
                update: function(bomb) {
                    let cOp = bomb.obj.style.opacity;
                    let cW = bomb.obj.offsetWidth;
                    cOp -= 0.2;
                    if (cOp <= 0) {
                        bomb.active = false;
                        bomb.obj.style.display = "none";
                    }
                    else {
                        bomb.obj.style.opacity = cOp;
                    }
                }
            }, true)
        );
    };
    me.puff = (mX=null,mY=null) => {

        let validSpeks = [
            "spk-a1",
            "spk-a2",
            "spk-b1",
            "spk-b2",
            "spk-c1",
            "spk-c2",
            "spk-d1",
            "spk-d2",
            "spk-x",
            "spk-x"
        ];
    
        let r = Math.floor(Math.random() * 25) + 15;

        if (mX==null) {
            mX = Math.floor(Math.random() * me.w);
        }

        if (mY==null) {
            mY = Math.floor(Math.random() * me.h);
        }

        let addR = Math.floor(Math.random() * 30);
        for (let a = 0; a < 360; a+=addR) {
            let r1 = Math.floor(Math.random() * r);
            let ix1 = Math.floor(Math.random() * validSpeks.length);
            let k1 = validSpeks[ix1];
            let nDir = a;
            let nVel = Math.floor(Math.random() * 5) + 5;
            let nD = Math.floor(Math.random() * (r - 15)) + 15;
            let nX = mX + (nD * Math.cos(a * Math.PI / 180));
            let nY = mY + (nD * Math.sin(a * Math.PI / 180));
            if (nX > 0 && nX < me.w && nY > 0 && nY < me.h) {
                let nItem = new LItem(new LVector(nX, nY, nDir, nVel), spekOps[k1], {gen:me.step});
                if(me.addItem(nItem)) me.encode(nItem,'u');
            }
            addR += Math.floor(Math.random() * 20) + 10;
        }
        //console.log("puff - made");

        let pID = "puff-" + me.step;

        if (!("puffs" in me.extras)) me.extras["puffs"] = [];
        me.extras["puffs"].push(
            new LXtra(new LVector(mX, mY, 0, 0), {
                width: r * 2,
                init: function(puff) {
                    let nObj = document.createElement("div");
                    nObj.id = pID;
                    nObj.classList.add("xtra");
                    nObj.classList.add("puff");
                    nObj.style.left = puff.pos.x + "px";
                    nObj.style.top = puff.pos.y + "px";
                    nObj.style.opacity = 1;
                    nObj.innerHTML = "&compfn;"; //"&there4;&because;"
                    me.obj.append(nObj);
                    puff.obj = nObj;
                },
                update: function(puff) {
                    let cOp = puff.obj.style.opacity;
                    let cW = puff.obj.offsetWidth;
                    cOp -= 0.2;
                    if (cOp <= 0) {
                        puff.active = false;
                        puff.obj.style.display = "none";
                    }
                    else {
                        puff.obj.style.opacity = cOp;
                    }
                }
            }, true)
        );
        
    };
    me.drip = (mX=null,mY=null) => {
        let r = Math.floor(Math.random() * 70) + 30;

        if (mX==null) {
            mX = Math.floor(Math.random() * (me.w + 400)) - 200;
        }

        if (mY==null) {
            mY = Math.floor(Math.random() * (me.h + 400)) - 200;
        }

        let dID = "drip-" + me.step;
        let drip = {
            id: dID,
            pos: new LVector(mX, mY, 0, 0),
            ops: { range: r, type: "drip" }
        };
        let close = me.query(drip);
        close.forEach((elem) => {
            if (elem.active) {
                let dRes = elem.pos.subtract(drip.pos);

                let dA = dRes.dir % 360;
                let force = 20;
                let nVel = ((r - dRes.magnitude()) + 1) * 3;
                if (elem.pos.vel < 0.5) {
                    elem.obj.classList.add("hit-by-" + dID + "-1");
                    elem.pos.dir = dA;
                    elem.pos.vel += nVel;
                }
                else {
                    elem.obj.classList.add("hit-by-" + dID + "-2");
                    elem.pos.vel += nVel;
                    elem.pos.dir = dA;
                }
            }
        });

        if (Math.random() > 0.5) {
            let nDir = Math.floor(Math.random() * 360);
            let nBlip = new LItem(new LVector(mX, mY, 0, nDir), struckOps["blip"], { gen: lf.step });
            nBlip.obj.style.opacity = 0.4;
            lf.queueItem(nBlip);
        }

        let gs = [ "spk-g1", "spk-g2" ];
        let gCount = Math.floor(Math.random() * 4) + 3;
        let gA = Math.floor(Math.random() * 360);
        let addA = 360 / gCount;
        for (let g = 0; g < gCount; g++) {
            let nVel = Math.floor(Math.random() * 10) + 10;
            let gName = gs[Math.floor(Math.random() * gs.length)];
            let nGas = new LItem(new LVector(mX, mY, nVel,gA), spekOps[gName], { gen: lf.step });
            lf.queueItem(nGas);
            gA += addA;
            gA = gA % 360;
        }

        if (!("drips" in me.extras)) me.extras["drips"] = [];
        me.extras["drips"].push(
            new LXtra(new LVector(mX, mY, 0, 0), {
                width: r * 2,
                init: function(drip) {
                    let nObj = document.createElement("div");
                    nObj.id = dID;
                    nObj.classList.add("xtra");
                    nObj.classList.add("drip");
                    nObj.style.left = drip.pos.x + "px";
                    nObj.style.top = drip.pos.y + "px";
                    nObj.style.width = drip.ops.width + "px";
                    nObj.style.height = drip.ops.width + "px";
                    nObj.style.opacity = 1;
                    me.obj.append(nObj);
                    drip.obj = nObj;
                },
                update: function(drip) {
                    let cOp = drip.obj.style.opacity;
                    let cW = drip.obj.offsetWidth;
                    cOp -= 0.1;
                    if (cOp <= 0) {
                        drip.active = false;
                        drip.obj.style.display = "none";
                    }
                    else {
                        drip.obj.style.opacity = cOp;
                        cW += (drip.ops.width / 20);
                        if (cW <= drip.ops.width * 2) {
                            drip.obj.style.width = cW + "px";
                            drip.obj.style.height = cW + "px";
                        }
                    }
                }
            }, true)
        );
    };
    me.runtests = () => {
        // no current tests
    };
    me.loadInit = () => {
        console.log("Load init");
        for (let tk1 in ortOps) {
            if (ortOps[tk1].formula() > 0) 
                ortDataSel["d-" + ortOps[tk1].formula()] = tk1;
        }
        me.refresh();
    };
    me.init = () => {
        me.runtests();

        for (let tk1 in ortOps) {
            if (ortOps[tk1].formula() > 0) 
                ortDataSel["d-" + ortOps[tk1].formula()] = tk1;
        }

        switch (me.initMode) {
            case "none":
            case "bomb":

                break;
            case "s-bomb":

                let rCount = Math.floor(Math.random() * 60) + 40;
                
                for (let rb = 0; rb < rCount; rb++) {
                    me.bomb();
                }

                break;
            case "sta-puff":

                for (let i = 0; i < 7500; i++) {
                    let x1 = Math.floor(Math.random() * me.w);
                    let y1 = Math.floor(Math.random() * me.h);
                    let data = 0;
                    let r1 = Math.floor(Math.random() * spekOpsSel.length);
                    let k1 = spekOpsSel[r1];
                    let nItem = new LItem(new LVector(x1, y1, 0, 0), spekOps[k1], {gen: me.step});
                    if (me.addItem(nItem)) me.encode(nItem,'i');
                }

                break;
            case "staspek":
            case "sta-puff":
            case "pushes":
                for (let i = 0; i < 2000; i++) {
                    let x1 = Math.floor(Math.random() * me.w);
                    let y1 = Math.floor(Math.random() * me.h);
                    let data = 0;
                    let r1 = Math.floor(Math.random() * spekOpsSel.length);
                    let k1 = spekOpsSel[r1];
                    let nItem = new LItem(new LVector(x1, y1, 0, 0), spekOps[k1], {gen: me.step});
                    if (me.addItem(nItem)) me.encode(nItem,'i');
                }
                
                break;
            case "mv-test":

                break;
            case "brane-test":
                for (let i = 0; i < 2000; i++) {
                    let x1 = Math.floor(Math.random() * me.w);
                    let y1 = Math.floor(Math.random() * me.h);
                    let nItem = new LItem(new LVector(x1, y1, 0, 0), snipOps["snp-blk"], {gen: me.step, code: snipOps["snp-blk"].data });
                    if (me.addItem(nItem)) me.encode(nItem,'i');
                }
                break;
            case "seed-test":
                    for (let i = 0; i < 2000; i++) {
                        let x1 = Math.floor(Math.random() * me.w);
                        let y1 = Math.floor(Math.random() * me.h);
                        let nItem = new LItem(new LVector(x1, y1, 0, 0), snipOps["snp-ex"], {gen: me.step, code: snipOps["snp-ex"].data });
                        if (me.addItem(nItem)) me.encode(nItem,'i');
                    }
                    break;
            case "seed-test2":
                    for (let i = 0; i < 500; i++) {
                        let x1 = Math.floor(Math.random() * me.w);
                        let y1 = Math.floor(Math.random() * me.h);
                        let nItem = new LItem(new LVector(x1, y1, 0, 0), ortOps["ort-e"], {gen: me.step });
                        if (me.addItem(nItem)) me.encode(nItem,'i');
                    }
                    for (let i = 0; i < 500; i++) {
                        let x1 = Math.floor(Math.random() * me.w);
                        let y1 = Math.floor(Math.random() * me.h);
                        let nItem = new LItem(new LVector(x1, y1, 0, 0), spekOps["spk-g1"], {gen: me.step });
                        if (me.addItem(nItem)) me.encode(nItem,'i');
                    }
                    for (let i = 0; i < 2000; i++) {
                        let x1 = Math.floor(Math.random() * me.w);
                        let y1 = Math.floor(Math.random() * me.h);
                        let nItem = new LItem(new LVector(x1, y1, 0, 0), spekOps["spk-g2"], {gen: me.step });
                        if (me.addItem(nItem)) me.encode(nItem,'i');
                    }
                    //for (let i = 0; i < 10; i++) {
                    //    let x1 = (me.w / 2) + ((i+1) * 40);
                    //    let y1 = me.h / 2;
                    //    let nItem = new LItem(new LVector(x1, y1, 0, 0), snipOps["snp-ex"], {gen: me.step, code: "e--" });
                    //    if (me.addItem(nItem)) me.encode(nItem,'i');
                    //}
                    break;
            case "feed-test":
                    let sX = me.w / 2;
                    let sY = me.h / 2;
                    for (let i = 0; i < 5; i++) {
                        let nSd = new LItem(new LVector(sX + ((i + 1) * 60), sY - ((i + 1) * 60), 0, 0), snipOps["snp-ex"], {gen: me.step, code: "e--" });
                        if (me.addItem(nSd)) me.encode(nSd,'i');
                    }
                    break;
            case "cell-test":
                for (let i = 0; i < 1000; i++) {
                    let x1 = Math.floor(Math.random() * me.w);
                    let y1 = Math.floor(Math.random() * me.h);
                    let nItem = new LItem(new LVector(x1, y1, 0, 0), snipOps["snp-blk"], {gen: me.step, code: "ppp" });
                    if (me.addItem(nItem)) me.encode(nItem,'i');
                }
                for (let i = 0; i < 500; i++) {
                    let x1 = Math.floor(Math.random() * me.w);
                    let y1 = Math.floor(Math.random() * me.h);
                    let nCodes = ["aaa","aab","aac","aad","bbb","bba","bbc","ccc","cab","cad","aba","abc","abd","baa","bab","bac","bad","cbb","cbc","cbd"];
                    let nItem = new LItem(new LVector(x1, y1, 0, 0), strandOps, {gen: me.step, codes: nCodes, genetic: {} });
                    if (me.addItem(nItem)) me.encode(nItem,'i');
                }
                break;
            case "d-test":
                for (let i = 0; i < 2000; i++) {
                    let x1 = Math.floor(Math.random() * me.w);
                    let y1 = Math.floor(Math.random() * me.h);
                    let nItem = new LItem(new LVector(x1, y1, 0, 0), ortOps["ort-d"], {gen: me.step});
                    if (me.addItem(nItem)) me.encode(nItem,'i');
                }
                for (let i = 0; i < 200; i++) {
                    let x1 = Math.floor(Math.random() * me.w);
                    let y1 = Math.floor(Math.random() * me.h);
                    let nItem = new LItem(new LVector(x1, y1, 0, 0), ortOps["ort-a"], {gen: me.step});
                    if (me.addItem(nItem)) me.encode(nItem,'i');
                }
                for (let i = 0; i < 200; i++) {
                    let x1 = Math.floor(Math.random() * me.w);
                    let y1 = Math.floor(Math.random() * me.h);
                    let nItem = new LItem(new LVector(x1, y1, 0, 0), ortOps["ort-b"], {gen: me.step});
                    if (me.addItem(nItem)) me.encode(nItem,'i');
                }
                for (let i = 0; i < 200; i++) {
                    let x1 = Math.floor(Math.random() * me.w);
                    let y1 = Math.floor(Math.random() * me.h);
                    let nItem = new LItem(new LVector(x1, y1, 0, 0), ortOps["ort-c"], {gen: me.step});
                    if (me.addItem(nItem)) me.encode(nItem,'i');
                }
                break;
            case "sd-test":
                let cds = [];
                let pts = ["a","b","c"];
                for (let vv = 0; vv <= 26; vv++) {
                    let nCode = pts[Math.floor(Math.random() * pts.length)];
                    nCode += pts[Math.floor(Math.random() * pts.length)];
                    nCode += pts[Math.floor(Math.random() * pts.length)];
                    cds.push(nCode);
                }
                let nItem = new LItem(new LVector(me.w / 2, me.h / 2, 0, 15), strandOps, {gen: me.step, codes: cds }, {});
                if (me.addItem(nItem)) me.encode(nItem,'i');

                let nItem2 = new LItem(new LVector(nItem.pos.x + 40, nItem.pos.y, 0, 0), struckOps["blip"], { gen: me.step });
                if (me.addItem(nItem2)) me.encode(nItem2,'i');
                break;
            case "chaos":
                let gCount = Math.floor(Math.random() * 200) + 200;
                let gs = [ "spk-g1", "spk-g2" ];
                let gIdx = 0;
                for (let g = 0; g < gCount; g++) {
                    let nX = Math.floor(Math.random() * me.w);
                    let nY = Math.floor(Math.random() * me.h);
                    let nVel = Math.floor(Math.random() * 5) + 5;
                    let nDir = Math.floor(Math.random() * 360);
                    let gName = gs[gIdx];
                    gIdx = gIdx + 1 >= gs.length ? 0 : gIdx + 1;
                    let nGas = new LItem(new LVector(nX, nY, nVel, nDir), spekOps[gName], { gen: lf.step });
                    if (me.addItem(nGas)) me.encode(nGas,'i');
                }


                me.extras["vents"] = [];
                let vCount = Math.floor(Math.random() * 3) + 1;
                for (let v = 0; v < vCount; v++) {
                    let vID = "vent-" + me.step + "-" + v;
                    let vX = Math.floor(Math.random() * (me.w - 100)) + 50;
                    let vY = Math.floor(Math.random() * (me.h - 100)) + 50;
                    me.extras["vents"].push(
                        new LXtra(new LVector(vX, vY, 0, 0), {
                            angle: Math.floor(Math.random() * 360),
                            init: function(vent) {
                                let nObj = document.createElement("div");
                                nObj.id = vID;
                                nObj.classList.add("xtra");
                                nObj.classList.add("vent");
                                nObj.style.left = vent.pos.x + "px";
                                nObj.style.top = vent.pos.y + "px";
                                let vRot = Math.floor(Math.random() * 360);
                                nObj.style.transform += "translateX(-50%) translateY(-50%) rotate(" + vRot + "deg)";
                                
                                nObj.innerHTML = "&#x3DF;"; //"&divonx;"; 
                                me.obj.append(nObj);
                                vent.obj = nObj;
                            },
                            update: function(vent) {
                                if (Math.random() > 0.8 && Object.keys(me.items).length < gVars.maxItems) {
                                    let nDir = Math.floor(Math.random() * 360);
                                    let nVel = Math.floor(Math.random() * 3) + 1;
                                    let nGas = new LItem(new LVector(vent.pos.x, vent.pos.y, vent.ops.angle, nVel), spekOps["spk-g3"],{ gen: lf.step });
                                    lf.queueItem(nGas);
                                    vent.ops.angle += 20;
                                }
                            }
                        }, true)
                    );
                }


                break;
        }

        me.refresh();
    };
    me.update = () => {

        me.additems.length = 0;

        me.roll();

        for (let ev = me.events.length - 1; ev >= 0; ev--) {
            if (typeof me.events[ev].run === 'function') me.events[ev].run(me.events[ev].params);
            me.events.splice(ev,1); 
        }

        switch (me.initMode) {
            case "r-bomb":
            case "s-bomb": 
                if (Math.random() > 0.7) {
                    let bCount = Math.floor(Math.random() * 6) + 3;
                    let bX = Math.floor((Math.random() * (me.w / 2)) + (me.w / 4));
                    let bY = Math.floor((Math.random() * (me.h / 2)) + (me.h / 4));
                    for (let bc = 0; bc < bCount; bc++) {
                        //console.log("bomb");
                        let bX2 = bX + (30 - (Math.floor(Math.random() * 61)));
                        let bY2 = bY + (30 - (Math.floor(Math.random() * 61)));
                        me.bomb(bX2, bY2);
                    }
                }
                break;
            case "seed-test2":
            case "feed-test":
                if (document.querySelectorAll(".proto").length == 0) {
                    let mvCodes = ["aaa","bbb","bba","bbc","cba","cbb","cbc","cbd"]; 
                    let mvDynamic = {
                        codes: mvCodes
                    };

                    let nVel = 0;
                    let nDir = Math.floor(Math.random() * 360);
                    if (me.initMode == "feed-test") nDir = -45;

                    let mvPro = new LItem(new LVector(me.w / 2, me.h / 2, nDir, nVel), protoOps["proto-1a"], mvDynamic, {});
                    me.queueItem(mvPro);
                }
                break;
            case "mv-test":
                if (document.querySelectorAll(".proto").length == 0) {

                    let mvCodes = []; //["aaa","bbb","aab","aad","bab","bac","bba","bbc"];
                    if (Math.random() > 0.5) { mvCodes.push("aab"); mvCodes.push("aad"); }
                    if (Math.random() > 0.5) { mvCodes.push("bab"); mvCodes.push("bac"); }
                    if (Math.random() > 0.5) { mvCodes.push("bba"); mvCodes.push("bbc"); }
                    if (Math.random() > 0.5 || mvCodes.length == 0) { mvCodes.push("aaa"); mvCodes.push("bbb"); }
                    let mvDynamic = {
                        codes: mvCodes
                    };

                    let nVel = 0;
                    let nDir = Math.floor(Math.random() * 360);

                    console.log("mv-test " + nDir + ",0");
                    let mvPro = new LItem(new LVector(me.w / 2, me.h / 2, 30, nDir, 0), protoOps["proto-1a"], mvDynamic, {});
                    me.queueItem(mvPro);
                }
                break;
            case "r-puff":
            case "sta-puff": 
                if (Math.random() > 0.8) {
                    let bX = Math.floor((Math.random() * (me.w / 2)) + (me.w / 4));
                    let bY = Math.floor((Math.random() * (me.h / 2)) + (me.h / 4));
                    me.puff(bX, bY);
                }
                break;
            case "t-puff":
                if (Math.random() > 0.6) {
                    let bX = Math.floor((Math.random() * (me.w / 2)) + (me.w / 4));
                    let bY = Math.floor((Math.random() * (me.h / 2)) + (me.h / 4));
                    me.puff(bX, bY);
                }
                break;
            case "brane-test":
            case "seed-test":
                if (Math.random() > 0.5) {
                    let bX = Math.floor((Math.random() * (me.w / 2)) + (me.w / 4));
                    let bY = Math.floor((Math.random() * (me.h / 2)) + (me.h / 4));
                    me.puff(bX, bY);
                }
                break;
            case "complex-test":

                if (document.querySelectorAll(".proto").length == 0) {
                    let mvCodes = []; //["aaa","bbb","aab","aad","bab","bac","bba","bbc"];
                    if (Math.random() > 0.5) { mvCodes.push("aab"); mvCodes.push("aad"); }
                    if (Math.random() > 0.5) { mvCodes.push("bab"); mvCodes.push("bac"); }
                    if (Math.random() > 0.5) { mvCodes.push("bba"); mvCodes.push("bbc"); }
                    if (Math.random() > 0.5 || mvCodes.length == 0) { mvCodes.push("aaa"); mvCodes.push("bbb"); }
                    let mvDynamic = {
                        codes: mvCodes
                    };

                    let nVel = 0;
                    let nDir = Math.floor(Math.random() * 360);

                    let iOps = {
                        init: true,
                        complex: 1
                    };
                    let iType = "proto-1b";
                    if (Math.random() > 0.5) {
                        iOps.complex = 2;
                        iType = "proto-1a";
                    }

                    let mvPro = new LItem(new LVector(me.w / 2, me.h / 2, nDir, 0), protoOps[iType], mvDynamic, {}, iOps);
                    me.queueItem(mvPro);
                }

                break;
            case "chaos": 
                if (!("drags" in me.extras)) me.extras["drags"] = [];

                if (Object.keys(me.items).length < gVars.maxItems) {
                    if (Math.random() > me.chaosOps.bombRate) me.bomb();
                    if (Math.random() > me.chaosOps.puffRate) me.puff();
                }
                if (Math.random() >= me.chaosOps.dripRate) me.drip();

                if (Math.random() > 0.5) me.chaosOps.dripRate += Math.random() > 0.5 ? -0.1 : 0.1;
                if (me.chaosOps.dripRate >= 0.6) me.chaosOps.dripRate = 0.6;
                else if (me.chaosOps.dripRate <= 0.1) me.chaosOps.dripRate = 0.1;

                break;
        }

        Object.keys(me.extras).forEach((exk) => {
            for (let ex = me.extras[exk].length - 1; ex >= 0; ex--) {
                me.extras[exk][ex].update();
                if (!me.extras[exk][ex].active) {
                    if (me.extras[exk][ex].obj != null) me.extras[exk][ex].obj.remove();
                    me.extras[exk].splice(ex,1);
                }
            }
        });

        let iCount = 0;
        let aiCount = 0;
        Object.keys(me.items).forEach((iky) => {
            if (me.items[iky] != undefined && me.items[iky] != null) {
                iCount++;
                me.items[iky].update();
                if (me.items[iky].active) {
                    aiCount++;
                }
            }
        });

        me.refresh();

        me.additems.forEach((ai) => {
            me.addItem(ai);
            me.encode(ai,'u');
        });

        me.additems.length = 0;
        //console.log(me.snipStats);
        let iCount2 = Object.keys(me.items).length;
        let cOut = "s:" + me.step + "<br/>i:" + iCount2 + " / " + gVars.maxItems;
        if (me.snipStats.show) {
            cOut += "<br/><u>ss</u>";
            Object.keys(me.snipStats).forEach((st) => {
                if (st != "show") {
                    cOut += "<br/>" + st + ":" + me.snipStats[st];
                }
            });
        }
        me.consoleset.out.innerHTML = cOut;
        me.step++;
    };
    me.output = () => {
        let oStr = "";
        oStr += "{\"lf\": {\"step\":" + me.step + ",\"tmode\":\"load\"},";
        oStr += "\"items\": ";
        oStr += JSON.stringify(me.items);
        oStr += "}"; 
        console.log(oStr);
    };
    me.load = () => {
        let cpText = document.createElement("textarea");
        let inStr = navigator.clipboard.readText()
        .then((clipText) => (cpText.value = clipText))
        .then(() => {
            loadLF(cpText);
        });
    };
    console.log("new LF");
}

function loadLF(lfObj) {
    let ldObj = JSON.parse(lfObj.value);
    lf = new LF(ldObj.lf);
    Object.keys(ldObj.items).forEach((itid) => {
        let ni = new LItem(new LVector(ldObj.items[itid].pos.x,ldObj.items[itid].pos.y,ldObj.items[itid].pos.dir,ldObj.items[itid].pos.vel),ldObj.items[itid].ops,JSON.parse(JSON.stringify(ldObj.items[itid].dynamic)),{init:false});
        ni.init();
        lf.obj.append(ni.obj);
        lf.items[itid] = ni;
    });
    lf.loadInit();
    lf.update();
}

function testIntersect(tX,tY,tW,tH,x1,y1,x2,y2) {
    return !(tX + tW < x1 || 
                 tX > x2 || 
                 tY + tH < y1 || 
                 tY > y2);
}

function meanAngleDeg(a) {
    return 180 / Math.PI * Math.atan2(
        aSum(a.map(degToRad).map(Math.sin)) / a.length,
        aSum(a.map(degToRad).map(Math.cos)) / a.length
    );
}

function aSum(a) {
    var s = 0;
    for (var i = 0; i < a.length; i++) s += a[i];
    return s;
} 

function degToRad(a) {
    return Math.PI / 180 * a;
}

function groupObj(obj,req = []) {
    let sums = {};
    req.forEach((rq) => { sums[rq] = 0; });
    obj.forEach((it) => {
        if (it in sums) sums[it]++;
        else sums[it] = 1;
    });
    return sums;
}

let rt = null;
let running = false;
let lastClick = new Date();

function run() {
    clearTimeout(rt);
    lf.consoleset.statusIcon.style.color = "green";
    lf.consoleset.status.innerHTML = "running";
    lf.update();
    if (running) rt = setTimeout(run, 50);
}

addEventListener("DOMContentLoaded", () => {
    lf = new LF();
    lf.init();
});

addEventListener("mouseup", (event) => {
    let thisClick = new Date();
    if (event.button == 0 && thisClick - lastClick <= 300) {
        if (lf.initMode == "bomb" || lf.initMode == "r-bomb") {
            lf.bomb(event.clientX, event.clientY);
        }
        else if (lf.initMode == "r-puff") {
            lf.events.push({run: function(params) {
                lf.puff(params.x, params.y);
            }, params: { x: event.clientX, y: event.clientY }});
        }
        else if (lf.initMode == "t-puff") {
            lf.events.push({run: function(params) {
                lf.puff(params.x, params.y);
            }, params: { x: event.clientX, y: event.clientY }});
        }
        else if (lf.initMode == "chaos") {
            lf.events.push({run: function(params) {
                lf.drip(params.x, params.y);
            }, params: { x: event.clientX, y: event.clientY }});
        }
    }
    lastClick = thisClick;
});

addEventListener("keyup", (event) => {
    //if (event.code.toLowerCase() == 'space') lf.update();
    if (event.code.toLowerCase() == 'space') {
        if (running) {
            lf.stop();
        }
        else {
            console.log("running step " + lf.step);
            running = true;
            run();
        }
    }
    else if (event.code.toLocaleLowerCase() == "arrowright") {
        lf.update();
    }
    else if (event.code.toLocaleLowerCase() == "arrowdown") {
        lf.output();
    }
    else if (event.code.toLocaleLowerCase() == "arrowup") {
        lf.load();
    }
    else if (event.code.toLocaleLowerCase() == "arrowleft") {
        lf.snipStats.show = !lf.snipStats.show;
    }
    
    if (event.key.toLocaleLowerCase() == "u") {
        gVars.maxItems += 500;
    }
});


addEventListener("mousemove", (event) => {
    document.getElementById("mouseDisp").innerHTML = event.clientX + "," + event.clientY;
});