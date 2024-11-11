let lf;
let mousePosX = 0;
let mousePosY = 0;
let helpOn = false;

const gVars = {
    braneCount: 3,
    seedCount: 3,
    spekColl: false,
    minStrandLen: 24,
    minStransLenS: 18,
    maxItems: 5000,
    huskDecay: 3000,
    vactCount: 9
}

function PNoise()  {
    let me = this;
    me.grid = [];
    me.nodes = 4;   
    me.gradients = {};
    me.memory = {};
    me.startx = 0.1;
    me.starty = 0.1;
    
    me.rVector = () => {
        let th = Math.random() * 2 * Math.PI;
        return { x: Math.cos(th), y: Math.sin(th) };
    };

    me.dpGrid = (x,y,x2,y2) => {
        let g1 = me.gradients[[x2,y2]] ? me.gradients[[x2,y2]] : me.rVector();
        me.gradients[[x2,y2]] = g1;
        let d1 = { x: x - x2, y: y - y2 };
        return d1.x * g1.x + d1.y * g1.y;
    };

    me.smooth = (x) => {
        return 6*x**5 - 15*x**4 + 10*x**3;
    };

    me.interp = (x, a, b) => {
        return a + me.smooth(x) * (b-a);
    };

    me.get = (x,y) => {
        if (me.memory.hasOwnProperty([x,y])) return me.memory[[x,y]];
        let xf = Math.floor(x);
        let yf = Math.floor(y);
        //interpolate
        let tl = this.dpGrid(x, y, xf,   yf);
        let tr = this.dpGrid(x, y, xf+1, yf);
        let bl = this.dpGrid(x, y, xf,   yf+1);
        let br = this.dpGrid(x, y, xf+1, yf+1);
        let xt = this.interp(x-xf, tl, tr);
        let xb = this.interp(x-xf, bl, br);
        let v = this.interp(y-yf, xt, xb);
        this.memory[[x,y]] = v;
        return v;
    };

    me.next = () => {
        me.startx += 0.1;
        me.starty += 0.1;
        return me.get(me.startx,me.starty) * 0.5 + 0.5;
    };

    for (let i = 0; i < me.nodes * me.nodes; i++) {
        me.grid.push(me.rVector());
    }
}

const LFEngine = {
    noise: new PNoise(),
    default: {
        init: function() {

        },
        run: function() {

        }
    },
    chaos: {
        init: function() {
            let jj = 0;
            let spks = [];

            Object.keys(lfcore.spek).forEach((ky) => { if (ky.indexOf("spek") == 0) spks.push(ky); });

            for (let ii = 0; ii < 500; ii++) {
                let nX = Math.floor(Math.random() * lf.w);
                let nY = Math.floor(Math.random() * lf.h);
                lf.haze.add(nX, nY, spks[jj], 2);

                jj = jj + 1 < spks.length ? jj + 1 : 0;
            }

            let vCount = Math.floor(Math.random() * 2) + 1;
            for (let v = 0; v < vCount; v++) {
                lfcore.xtra.vent();
            }
        },
        run: function() {

            if (Math.random() > 0.6 && lf.items.length < gVars.maxItems) {
                lfcore.xtra.puff();
            }

            if (Math.random() > 0.9 && lf.items.length < gVars.maxItems) {
                lfcore.xtra.bomb();
            }

            if (lf.engine.noise.next() > 0.5) {
                lfcore.xtra.drip();
            }
        }
    },
    single: {
        init: function() {

        },
        run: function() {
            if (document.querySelectorAll(".proto").length == 0) {
                let mvCodes = ["aaa","bbb","bba","bbc","cba","cbb","cbc","cbd"]; 
                let mvDynamic = {
                    codes: mvCodes
                };

                let nVel = 0;
                let nDir = Math.floor(Math.random() * 360);

                let mvPro = new LFItem(new LFVector(me.w / 2, me.h / 2, nDir, nVel), lfcore.proto.protoS, mvDynamic, { init: true, complex: 1 });
                lf.queueItem(mvPro);
            }
        }
    },
    spawntest: {
        init: function() {
            for (let ii = 0; ii < 200; ii++) {
                let nX = Math.floor(Math.random() * lf.w);
                let nY = Math.floor(Math.random() * lf.h);
                if (Math.random() > 0.5) {
                    let nBrane = new LFItem(new LFVector(nX,nY,Math.floor(Math.random() * 360), 1), lfcore.struck.struckBrane, { mtype: "S" });
                    nBrane.obj.classList.add("b2");
                    lf.addItem(nBrane);
                }
                else {
                    let nBrane = new LFItem(new LFVector(nX,nY,Math.floor(Math.random() * 360), 1), lfcore.struck.struckBrane, { mtype: "C" });
                    lf.addItem(nBrane);
                }
            }

            let cTest = ["a","b","c","d"];
            for (let ii = 0; ii < 300; ii++) {
                let cList = [];
                let tCodes = Math.floor(Math.random() * 10) + 18;
                for (let jj = 0; jj < tCodes; jj++) {
                    let nCode = cTest[Math.floor(Math.random() * cTest.length)];
                    nCode += cTest[Math.floor(Math.random() * cTest.length)];
                    nCode += cTest[Math.floor(Math.random() * cTest.length)];
                    cList.push(nCode);
                }
                let nX = Math.floor(Math.random() * lf.w);
                let nY = Math.floor(Math.random() * lf.h);
                let nStrand = new LFItem(new LFVector(nX,nY,Math.floor(Math.random() * 360), 5), lfcore.strand.strandD, { codes: cList });
                lf.addItem(nStrand);
            }
        },
        run: function() {
         
        }
    },
    vtest: {
        init: function() {
            let vCodes = [
                "uca", // pseudo-v marker
                "ucb", // pseudo-v marker
                "ucc", // pseudo-v marker
                "ucu", // pseudo-v marker
                "uua", // pseudo-v marker
                "ucb", // pseudo-v marker
                "uuc",  // pseudo-v marker
                "uuu"
            ];

            let vCodes2 = [
                "uca", // pseudo-v marker
                "ucb", // pseudo-v marker
                "uca", // pseudo-v marker
                "ucb", // pseudo-v marker
                "ucc", // pseudo-v marker
                "ucu", // pseudo-v marker
                "uua", // pseudo-v marker
            ];

            let vCodes3 = [
                "aau", // pseudo-v marker
                "abu", // pseudo-v marker
                "acu", // pseudo-v marker
                "auu", // pseudo-v marker
                "uub", // pseudo-v marker
                "uuc", // pseudo-v marker
            ];


            for (let ii = 0; ii < 70; ii++) {
                let nX = Math.floor(Math.random() * lf.w);
                let nY = Math.floor(Math.random() * lf.h);
                lf.addItem(new LFItem(new LFVector(nX,nY,Math.floor(Math.random() * 360), 1), lfcore.strand.strandR, { codes: JSON.parse(JSON.stringify(vCodes2)) }));
            }

            vCodes3.forEach((cd) => {
                for (let ii = 0; ii < 600; ii++) {
                    let nX = Math.floor(Math.random() * lf.w);
                    let nY = Math.floor(Math.random() * lf.h);
                    lf.addItem(new LFItem(new LFVector(nX,nY,Math.floor(Math.random() * 360), 1), lfcore.snip.snipGo, { codes: [cd] }));
                }
            });

            for (let ii = 0; ii < 800; ii++) {
                let nX = Math.floor(Math.random() * lf.w);
                let nY = Math.floor(Math.random() * lf.h);
                lf.addItem(new LFItem(new LFVector(nX,nY,Math.floor(Math.random() * 360), 1), lfcore.snip.snipGo, { codes: ["uuu"] }));
            }

        },
        run: function() {
            if (document.querySelectorAll(".proto").length < 2) {

                let codes = [];
                codes.push(...lf.behaviors.presets["move1"]);
                codes.push(...lf.behaviors.presets["chem1"]);
                let nPro = new LFItem(new LFVector((lf.w / 2) + 5, lf.h / 2 - 5, Math.floor(Math.random() * 360), 0), lfcore.proto.protoS, { codes: codes }, { init: true, complex: 1});
                lf.addItem(nPro);

                let codes3 = [];
                codes3.push(...lf.behaviors.presets["move1"]);
                codes3.push(...lf.behaviors.presets["breathe2"]);
                let nPro3 = new LFItem(new LFVector((lf.w / 2) + 5, lf.h / 2 - 20, Math.floor(Math.random() * 360), 0), lfcore.proto.protoS, { codes: codes3 }, { init: true, complex: 1});
                lf.addItem(nPro3);

                let codes4= [];
                codes4.push(...lf.behaviors.presets["move4"]);
                codes4.push(...lf.behaviors.presets["seek"]);
                codes4.push(...lf.behaviors.presets["eat1"]);
                codes4.push(...lf.behaviors.presets["prey1"]);
                let nPro4 = new LFItem(new LFVector((lf.w / 2) - 20, (lf.h / 2), 0, 0), lfcore.proto.protoC, { codes: codes4 }, { init: true, complex: 2});
                nPro4.obj.classList.add("test-t");
                lf.addItem(nPro4);

                let nPro4b = new LFItem(new LFVector((lf.w / 2) + 20, (lf.h / 2), 180, 0), lfcore.proto.protoC, { codes: codes4 }, { init: true, complex: 2});
                nPro4b.obj.classList.add("test-t");
                lf.addItem(nPro4b)
            }

            if (Math.random() > 0.8) {
                let sX = Math.floor(Math.random() * lf.w);
                let sY = Math.floor(Math.random() * lf.h);
                let strenghts = [ 75, 200, 275 ];
                let strength = strenghts[Math.floor(Math.random() * strenghts.length)];

                lf.events.push({run: function(params) {
                    lfcore.xtra.splash(params.x, params.y, params.strength);
                }, params: { x: sX, y: sY, strength: strength }});
            }

        }
    },
    hazetest: {
        init: function() {
            let jj = 0;
            let spks = [];
            
            Object.keys(lfcore.spek).forEach((ky) => { if (ky.indexOf("spek") == 0) spks.push(ky); });

            for (let ii = 0; ii < 500; ii++) {
                let nX = Math.floor(Math.random() * lf.w);
                let nY = Math.floor(Math.random() * lf.h);
                lf.haze.add(nX, nY, spks[jj], 1);

                jj = jj + 1 < spks.length ? jj + 1 : 0;
            }

        },
        run: function() {
            lf.haze.update();

            if (lf.engine.noise.next() > 0.5) {
                lfcore.xtra.drip();
            }
        }
    },
    codetest: {
        init: function() {

            for (let ii = 0; ii < 200; ii++) {
                let nX = Math.floor(Math.random() * lf.w); //lf.w / 2; //Math.floor(Math.random() * lf.w);
                let nY = Math.floor(Math.random() * lf.h); //lf.h / 2; //Math.floor(Math.random() * lf.h);
                lf.haze.add(nX, nY, "spekG1", 1);
            }

            for (let ii = 0; ii < 200; ii++) {
                let nX = Math.floor(Math.random() * lf.w); //lf.w / 2; //Math.floor(Math.random() * lf.w);
                let nY = Math.floor(Math.random() * lf.h); //lf.h / 2; //Math.floor(Math.random() * lf.h);
                lf.haze.add(nX, nY, "spekG2", 1);
            }

            for (let ii = 0; ii < 1000; ii++) {
                let nX = Math.floor(Math.random() * lf.w); //lf.w / 2; //Math.floor(Math.random() * lf.w);
                let nY = Math.floor(Math.random() * lf.h); //lf.h / 2; //Math.floor(Math.random() * lf.h);
                lf.haze.add(nX, nY, "spekG3", 1);
            }

            for (let ii = 0; ii < 100; ii++) {
                let nX = Math.floor(Math.random() * lf.w); //lf.w / 2; //Math.floor(Math.random() * lf.w);
                let nY = Math.floor(Math.random() * lf.h); //lf.h / 2; //Math.floor(Math.random() * lf.h);
                lf.haze.add(nX, nY, "spekV", 1);
            }

            for (let ii = 0; ii < 50; ii++) {
                let nX = Math.floor(Math.random() * lf.w);
                let nY = Math.floor(Math.random() * lf.h);
                let nFood = new LFItem(new LFVector(nX, nY, Math.floor(Math.random() * 360), 0), lfcore.snip.snipEx, { code: "e--" });
                lf.addItem(nFood);
            }

            for (let ii = 0; ii < 10; ii++) {
                let nX = Math.floor(lf.w / 2) + (100 - Math.floor(Math.random() * 201));
                let nY = Math.floor(lf.h / 2) + (100 - Math.floor(Math.random() * 201));
                let nBrane = new LFItem(new LFVector(nX, nY, Math.floor(Math.random() * 360), 0), lfcore.struck.struckBrane, { type: "S"});
                lf.addItem(nBrane);
            }

            let vCount = Math.floor(Math.random() * 2) + 1;
            for (let v = 0; v < vCount; v++) {
                lfcore.xtra.vent(lf.w / 2, lf.h / 2);
            }
        },
        run: function() {
            if (document.querySelectorAll(".proto").length < 2) {

                let codes = [];
                codes.push(...lf.behaviors.presets["move1"]);
                codes.push(...lf.behaviors.presets["chem1"]);
                let nPro = new LFItem(new LFVector((lf.w / 2) + 5, lf.h / 2 - 5, Math.floor(Math.random() * 360), 0), lfcore.proto.protoS, { codes: codes }, { init: true, complex: 1});
                lf.addItem(nPro);

                let codes3 = [];
                codes3.push(...lf.behaviors.presets["move1"]);
                codes3.push(...lf.behaviors.presets["breathe2"]);
                let nPro3 = new LFItem(new LFVector((lf.w / 2) + 5, lf.h / 2 - 20, Math.floor(Math.random() * 360), 0), lfcore.proto.protoS, { codes: codes3 }, { init: true, complex: 1});
                lf.addItem(nPro3);

                let codes2 = [];
                codes2.push(...lf.behaviors.presets["move4"]);
                codes2.push(...lf.behaviors.presets["seek"]);
                codes2.push(...lf.behaviors.presets["eat1"]);
                let nPro2 = new LFItem(new LFVector((lf.w / 2), lf.h / 2, Math.floor(Math.random() * 360), 0), lfcore.proto.protoC, { codes: codes2 }, { init: true, complex: 2});
                lf.addItem(nPro2);

                let codes4= [];
                codes4.push(...lf.behaviors.presets["move4"]);
                codes4.push(...lf.behaviors.presets["seek"]);
                codes4.push(...lf.behaviors.presets["eat1"]);
                codes4.push(...lf.behaviors.presets["prey1"]);
                let nPro4 = new LFItem(new LFVector((lf.w / 2) - 20, (lf.h / 2), 0, 0), lfcore.proto.protoC, { codes: codes4 }, { init: true, complex: 2});
                //nPro4.obj.classList.add("test-t");
                //lf.addItem(nPro4);

                let nPro4b = new LFItem(new LFVector((lf.w / 2) + 20, (lf.h / 2), 180, 0), lfcore.proto.protoC, { codes: codes4 }, { init: true, complex: 2});
                //nPro4b.obj.classList.add("test-t");
                //lf.addItem(nPro4b)


                //lf.marker.track = nPro4.id;
                //lf.dbhr.track = nPro4.id;
                //lf.marker.obj.style.display = "block";
                //lf.dbhr.obj.style.display = "block";
            }
        }
    }
};

function LF() {
    let me = this;
    me.step = 0;
    me.obj = document.getElementById("main"); 
    me.consoleset = {
        status: document.getElementById("statusDisp"),
        statusIcon: document.getElementById("statusIcon"),
        out: document.getElementById("outDisp")
    };
    me.w = window.innerWidth;
    me.h = window.innerHeight;
    me.idc = 0;
    me.cache = {};
    me.marker = {
        obj: document.getElementById("marker"),
        track: null
    };
    me.dbhr = {
        obj: document.getElementById("dbhr"),
        track: null
    };
    me.chaosOps = {
        dripRate: 0.4,
        puffRate: 0.5,
        bombRate: 0.8
    };
    me.items = [];
    me.iHash = {};
    me.additems = [];
    me.extras = {};
    me.debugDisplay = false;
    me.events = [];
    me.behaviors = new LFCodedBehaviors();
    me.hash = new LFHash(me.w,me.h,50);
    me.haze = new LFHaze(me.w, me.h, 100);
    me.runmode = "chaos";
    me.engine = LFEngine;
    me.logging = {
        log: [],
        protos: {
            unknown: ""
        },
        other: {},
    };
    me.logAction = (id,msg) => {
        if (id == undefined || id == null || id.length == 0) me.logging.protos["uknown"] += msg;
        if (id in me.logging.protos) me.logging.protos[id] += msg + ";";
        else me.logging.protos[id] = msg + ";";
    };
    me.remEncode = (itemID) => {
        if (itemID in me.items) {
            me.hash.remove(itemID, me.items[itemID].pos.x, me.items[itemID].pos.y);
            me.items[itemID].pos.hash = "";
        }
    };
    me.query = (item, type, qops = {}) => {
        if (item != undefined && item != null && item.pos != undefined && item.pos != null) {
            let qX = item.pos.x;
            let qY = item.pos.y;
            let qR = null;
            if (item.core != undefined) qR = item.core.range;
            if (qops != undefined && qops != null) {
                if ("x" in qops) qX = qops["x"];
                if ("y" in qops) qX = qops["y"];
                if ("range" in qops) qR = qops["range"];
            }

            if (qR != null) return me.hash.query(item,type,{ range: qR });
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
        me.hash.roll(me.items);
    };
    me.refresh = () => {
        for (let ih = me.items.length - 1; ih >= 0; ih--) {
            if (!me.items[ih].active)
                me.removeItem(me.items[ih].id);
        }
        for (let ih = 0; ih < me.items.length; ih++) {
            me.iHash[me.items[ih].id] = ih;
        }
    };
    me.generateID = () => {
        return "i-" + me.idc++ + "-" + Math.floor(Math.random() * 10000000);
    };
    me.addItem = (item) => {
        if (item.active && !(item.id in me.iHash)) {
            item.gen = me.step;
            me.items.push(item);
            me.iHash[item.id] = me.items.length - 1;
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
        if (itemID in me.iHash) {
            if (me.items[me.iHash[itemID]].core.type == "proto") me.logAction(itemID, "deactivated (" + me.items[me.iHash[itemID]].life + ") [" + me.items[me.iHash[itemID]].debug + "]");
            me.items.splice(me.iHash[itemID],1);
            delete me.iHash[itemID];
        }
    };
    me.pip = (x,y,id,content,pClass=null) => {
        let pipid = "pip-" + id;
        let p = document.getElementById(pipid);
        if (p == undefined || p == null) {
            p = document.createElement("div");
            p.id = pipid;
            p.classList.add("pip");
            me.obj.appendChild(p);
        }
        if (pClass != null && !p.classList.contains(pClass)) p.classList.add(pClass);
        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.transform = "translateX(-50%) translateY(-50%) rotate(" + Math.floor(Math.random() * 360) + "deg)";
        p.innerHTML = content;
        p.classList.remove("fade-out-1");
        void p.offsetWidth;
        p.classList.add("fade-out-1");
    };
    me.rempip = (id) => {
        let pip = document.getElementById("pip-" + id);
        if (pip != undefined && pip != null) pip.remove();
    }
    me.writelog = () => {
        console.log(me.logging);
    };
    me.init = () => {
        if (me.runmode in me.engine) me.engine[me.runmode].init();
        else me.engine.default.init();
        me.refresh();
    };
    me.update = () => {
        me.additems.length = 0;

        me.roll();
        me.haze.update();

        for (let ev = me.events.length - 1; ev >= 0; ev--) {
            if (typeof me.events[ev].run === 'function') me.events[ev].run(me.events[ev].params);
            me.events.splice(ev,1); 
        }

        if (me.runmode in me.engine) me.engine[me.runmode].run();
        else me.engine.default.run();

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
        me.items.forEach((it) => {
            iCount++;
            it.update();
            if (it.active) aiCount++;
        });

        me.refresh();

        me.additems.forEach((ai) => {
            aiCount++;
            iCount++;
            me.addItem(ai);
        });

        me.additems.length = 0;
        let cOut = "s:" + me.step + "<br/>i:" + iCount + " (" + aiCount + ") / " + gVars.maxItems;
        me.consoleset.out.innerHTML = cOut;
        me.step++;

        me.items.forEach((itm) => {
            let chkItm = document.querySelectorAll("#" + itm.id);
            if (chkItm.length > 1) {
                me.logging.multipleids.push(itm.id + "::" + itm.core.subtype + "::" + chkItm.length);
            }
        });
    };
}

let rt = null;
let running = false;
let lastClick = new Date();
let downKeys = [];

function run() {
    clearTimeout(rt);
    lf.consoleset.statusIcon.style.color = "green";
    lf.consoleset.status.innerHTML = "running";
    lf.update();
    if (running) rt = setTimeout(run, 50);
}

addEventListener("DOMContentLoaded", () => {
    fillDocs();
    lf = new LF();
    lf.init();
});

addEventListener("mouseup", (event) => {
    let thisClick = new Date();
    if (event.button == 0 && thisClick - lastClick <= 300) {
        if (lf.runmode == "chaos") {
            let strength = 75;
            if (downKeys.includes("4")) strength += 125;
            else if (downKeys.includes("3")) strength += 75;
            else if (downKeys.includes("2")) strength += 50;

            lf.events.push({run: function(params) {
                lfcore.xtra.splash(params.x, params.y, params.strength);
            }, params: { x: event.clientX, y: event.clientY, strength: strength }});
        }
        if (lf.runmode == "hazetest") {
            lf.events.push({run: function(params) {
                lfcore.xtra.drip(params.x, params.y);
            }, params: { x: event.clientX, y: event.clientY }});
        }
    }
    lastClick = thisClick;
});

addEventListener("keydown", (event) => {
    if (!downKeys.includes(event.key.toLowerCase())) downKeys.push(event.key.toLowerCase());
});

addEventListener("keyup", (event) => {
    const keyIndex = downKeys.indexOf(event.key.toLowerCase());
    if (keyIndex >= 0) downKeys.splice(keyIndex, 1);

    //if (event.code.toLowerCase() == 'space') lf.update();
    if (event.code.toLowerCase() == 'space') {
        toggleRun();
    }
    else if (event.code.toLowerCase() == "arrowright") {
        lf.update();
    }
    else if (event.code.toLowerCase() == "arrowdown") {
        //lf.output();
    }
    else if (event.code.toLowerCase() == "arrowup") {
        //lf.load();
    }
    else if (event.code.toLowerCase() == "arrowleft") {
        // TODO
    }
    else if (event.key.toLowerCase() == "o") {
        lf.events.push({run: function(params) {
            lfcore.xtra.drip(params.x, params.y);
        }, params: { x: lf.w / 2, y: lf.h / 2 }});
    }
    else if (event.key.toLowerCase() == "z") {
        //console.log("haze toggle");
        lf.haze.flip();
    }
    else if (event.key.toLowerCase() == "h") {
        toggleHelp();
    }
    else if (event.key.toLowerCase() == "l") {
        lf.writelog();
    }
    
    if (event.key.toLocaleLowerCase() == "u") {
        gVars.maxItems += 500;
    }
});

addEventListener("mousemove", (event) => {
    document.getElementById("mouseDisp").innerHTML = event.clientX + "," + event.clientY;
});

function toggleRun() {
    if (running) {
        lf.stop();
    }
    else {
        console.log("running step " + lf.step);
        running = true;
        run();
    }
}

function toggleHelp() {
    if (running) {
        lf.stop();
    }
    helpOn = !helpOn;
    if (helpOn) document.getElementById("doc").style.display = "block";
    else document.getElementById("doc").style.display = "none";
}

function fillDocs() {
    let spekKeys = Object.keys(lfcore.spek);
    let spekCount = 0;
    let spekList = "";
    for (let k = 0; k < spekKeys.length - 2; k++) {
        if (spekKeys[k].indexOf("spek") == 0) {
            if (k > 0 && k < spekKeys.length - 1) spekList += ", ";
            else if (k == spekKeys.length - 2) spekList += ", and ";
            spekList += lfcore.spek[spekKeys[k]].subtype.replace("spek","");
            spekCount++;
        }
    }
    document.getElementById("doc-spek-count").innerHTML = spekCount;
    document.getElementById("doc-spek-list").innerHTML = spekList;

    let ortKeys = Object.keys(lfcore.ort);
    let ortCount = 0;
    let ortList = "";
    for (let k = 0; k < ortKeys.length - 2; k++) {
        if (ortKeys[k].indexOf("ort") == 0) {
            if (k > 0 && k < ortKeys.length - 2) ortList += ", ";
            else if (k == ortKeys.length - 2) ortList += ", and ";
            ortList += lfcore.ort[ortKeys[k]].subtype.replace("ort","");
            ortList += " [<span class=\"doc-item-display ort-disp " + lfcore.ort[ortKeys[k]].class + "\" style=\"opacity:1;\">" + lfcore.ort[ortKeys[k]].content + "</span>]"
            ortCount++;
        }
    }
    document.getElementById("doc-ort-count").innerHTML = ortCount;
    document.getElementById("doc-ort-list").innerHTML = ortList;

    let snipKeys = Object.keys(lfcore.snip);
    let snipCount = 0;
    let snipList = "";
    for (let k = 0; k < snipKeys.length - 2; k++) {
        if (snipKeys[k].indexOf("snip") == 0) {
            if (k > 0 && k < snipKeys.length - 2) snipList += ", ";
            else if (k == snipKeys.length - 2) snipList += ", and ";
            snipList += "<span class=\"doc-item-display snip-disp " + lfcore.snip[snipKeys[k]].class + "\" style=\"opacity:1;\">" + lfcore.snip[snipKeys[k]].content + "</span>"
            snipCount++;
        }
    }
    //document.getElementById("doc-snip-count").innerHTML = ortCount;
    document.getElementById("doc-snip-list").innerHTML = snipList;

    let strandDisp = "<span class=\"doc-item-display strand-disp\" style=\"opacity:1;\">&infin;</span>"
    document.getElementById("doc-strand-list").innerHTML = strandDisp;

    let struckList = "";
    struckList += "<span class=\"doc-item-display struck-disp " + lfcore.struck.struckBrane.class + "\" style=\"opacity:1;\">" + lfcore.struck.struckBrane.content + "</span>";
    struckList +=", ";
    struckList += "<span class=\"doc-item-display struck-disp " + lfcore.struck.struckSeed.class + "\" style=\"opacity:1;\">" + lfcore.struck.struckSeed.content + "</span>";
    document.getElementById("doc-struck-list").innerHTML = struckList;
}