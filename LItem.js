function LItem(pos, ops, dynamic = {}, init = true) {
    let me = this;
    me.id = lf.generateID();
    me.gen = -1;
    me.active = true;
    me.obj = null;
    me.pos = pos;
    me.vx = 0;
    me.vy = 0;
    me.life = 0;
    me.hash = "";
    me.ops = defaultOps;
    me.dynamic = dynamic;
    me.style = {};
    me.update = () => {
        if (me.active) {
            switch (me.ops.type) {
                case "spek":

                    updateSpek(me);

                    break;
                case "ort":

                    updateOrt(me);

                    break;
                case "snip":

                    updateSnip(me);
                    
                    break;
                case "strand":
                    
                    updateStrand(me);

                    break;
                case "struck":
                    
                    updateStruck(me);

                    break;
                case "proto":

                    updateProto(me);

                    break;
            }
        }

        me.obj.setAttribute("x", me.pos.x);
        me.obj.setAttribute("y", me.pos.y);
        me.obj.setAttribute("dir", me.pos.dir);
        me.obj.setAttribute("vel", me.pos.vel);
    };
    me.deactivate = () => {
        me.active = false;
        //lf.removeItem(me.id);
    };
    me.init = () => {
        if (ops != undefined && ops != null) {
            me.life = me.ops.decay;
        }

        if (me.pos == null || me.ops == undefined || me.ops == null) {
            me.deactivate();
        }
        else {
            if (dynamic["gen"] != undefined && dynamic["gen"] != null)
                me.gen = dynamic["gen"];
            let nObj = document.createElement("div");
            nObj.id = me.id;
            nObj.style.left = me.pos.x + "px";
            nObj.style.top = me.pos.y + "px";
            nObj.classList.add(me.ops.type);
            nObj.classList.add(me.ops.name);
            let nCont = "[]";
            for (let ky in me.style) {
                nObj.style[ky] = me.style[ky];
            }
            switch (me.ops.type) {
                case 'spek':
                    nCont = me.ops.content;
                    break;
                case 'ort':
                    nCont = me.ops.content;
                    break;
                case 'snip':
                    nCont =  me.ops.content;
                    let sCode = me.dynamic["code"];
                    nObj.setAttribute("scode", sCode);
                    nObj.classList.add(me.ops.name);
                    nObj.classList.add("snp-" + sCode);

                    if (sCode in lf.snipStats) lf.snipStats[sCode]++;
                    else lf.snipStats[sCode] = 1;

                    break;
                case 'strand':
                    let cStrS = me.dynamic["codes"].join(":");
                    nObj.setAttribute("code",cStrS);
                    nCont = me.ops.content;
                    break;
                case 'struck':
                    nCont = me.ops.content;
                    break;
                case 'proto':
                    let cStrP = me.dynamic["codes"].join(":");
                    nObj.setAttribute("code",cStrP);
                    nCont = ""; 
                    if ("codes" in me.dynamic) {
                        if ((me.dynamic["codes"].includes("aab") || me.dynamic["codes"].includes("aac")) && me.dynamic["codes"].includes("aad")) {
                            nObj.classList.add("breather");
                            nCont += "&ratio;";
                            
                        }
                        if (me.dynamic["codes"].includes("bba") && me.dynamic["codes"].includes("bbc")) {
                            nObj.classList.add("eater");
                            nCont += "&hercon;";
                        }
                        if (me.dynamic["codes"].includes("aaa") && me.dynamic["codes"].includes("bbb")) {
                            nObj.classList.add("mover");
                            nCont += "&sc;";
                        }
                    }
                    if (nCont.length == 0) nCont = "-";
                    me.pos.dir = Math.floor(Math.random() * 360);
                    nObj.style.rotate = "z " + me.pos.dir + "deg";
                    break;
            }
            nObj.innerHTML = nCont;
            nObj.setAttribute("px", me.pos.x);
            nObj.setAttribute("py", me.pos.y);
            nObj.setAttribute("vx", me.vx);
            nObj.setAttribute("vy", me.vy);
            nObj.setAttribute("gen", me.gen);
            if (me.active) nObj.setAttribute("istat", "active");
            else nObj.setAttribute("istat", "inactive");

            nObj.setAttribute("q-on","");
            if (lf.debugDisplay) {
                nObj.addEventListener("mouseover", (ev) => {
                    let tg = ev.target;
                });
                nObj.addEventListener("mouseout", (ev) => {
                    let tg = ev.target;
                });
            }

            me.obj = nObj;

            me.pos.pID = me.id;
            me.pos.pType = me.ops.type;
        }
    };

    if (ops != undefined && ops != null) {
        me.ops = ops;
    }

    if (init) me.init();
}
