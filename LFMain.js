let lf;
let mousePosX = 0;
let mousePosY = 0;

const gVars = {
    braneCount: 3,
    seedCount: 3,
    spekColl: false,
    minStrandLen: 14,
    maxItems: 5000
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
            switch (lf.formation) {
                case "haze":
                    Object.keys(lfcore.spek).forEach((ky) => { if (ky.indexOf("spek") == 0) spks.push(ky); });

                    for (let ii = 0; ii < 500; ii++) {
                        let nX = Math.floor(Math.random() * lf.w);
                        let nY = Math.floor(Math.random() * lf.h);
                        lf.haze.add(nX, nY, spks[jj], 1);

                        jj = jj + 1 < spks.length ? jj + 1 : 0;
                    }

                    break;
                default:
                    Object.keys(lfcore.spek).forEach((ky) => { if (ky.indexOf("spek") == 0) spks.push(ky); });
                    for (let ii = 0; ii < 500; ii++) {
                        let nX = Math.floor(Math.random() * lf.w);
                        let nY = Math.floor(Math.random() * lf.h);
                        let nDir = Math.floor(Math.random() * 360);
                        let nSpek = new LFItem(new LFVector(nX, nY, nDir, 0), lfcore.spek[spks[jj]], {gen: lf.step});
                        lf.addItem(nSpek);

                        jj = jj + 1 < spks.length ? jj + 1 : 0;
                    }

                    break;
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

                let mvPro = new LFItem(new LFVector(me.w / 2, me.h / 2, nDir, nVel), lfcore.proto.protoS, mvDynamic, {}, { init: true, complex: 1 });
                lf.queueItem(mvPro);
            }
        }
    },
    hazetest: {
        init: function() {
            let jj = 0;
            let spks = [];
            
            switch (lf.formation) {
                case "haze":
                    Object.keys(lfcore.spek).forEach((ky) => { if (ky.indexOf("spek") == 0) spks.push(ky); });

                    for (let ii = 0; ii < 500; ii++) {
                        let nX = Math.floor(Math.random() * lf.w);
                        let nY = Math.floor(Math.random() * lf.h);
                        lf.haze.add(nX, nY, spks[jj], 1);

                        jj = jj + 1 < spks.length ? jj + 1 : 0;
                    }

                    break;
            }

        },
        run: function() {
            lf.haze.update();

            if (lf.engine.noise.next() > 0.5) {
                lfcore.xtra.drip();
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
    me.initMode = "chaos";
    me.marker = {
        obj: document.getElementById("marker"),
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
    me.formation = "haze"; //"spek";
    me.runmode = "chaos";
    me.engine = LFEngine;
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
            me.items.splice(me.iHash[itemID],1);
            delete me.iHash[itemID];
        }
    };
    me.init = () => {
        if (me.runmode in me.engine) me.engine[me.runmode].init();
        else me.engine.default.init();
        me.refresh();
    };
    me.update = () => {
        me.additems.length = 0;

        me.roll();
        if (me.formation == "haze") me.haze.update();

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
    };
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
        if (lf.runmode == "chaos" || lf.runmode == "hazetest") {
            lf.events.push({run: function(params) {
                lfcore.xtra.drip(params.x, params.y);
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
    else if (event.key.toLowerCase() == "h") {
        console.log("haze on");
        lf.haze.show();
    }
    
    if (event.key.toLocaleLowerCase() == "u") {
        gVars.maxItems += 500;
    }
});

addEventListener("mousemove", (event) => {
    document.getElementById("mouseDisp").innerHTML = event.clientX + "," + event.clientY;
});