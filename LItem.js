function LItem(pos, ops, dynamic = {}, genetic = {}, init = true) {
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
    me.genetic = genetic;
    me.transformFill = "translateX(-50%) translateY(-50%) rotate(***deg)";
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
                    let cLen = me.dynamic["codes"].length;
                    if (cLen >= gVars.minStrandLen) nObj.classList.add("sz-full");
                    else nObj.classList.add("sz-" + me.dynamic["codes"].length);
                    break;
                case 'struck':
                    nCont = me.ops.content;
                    break;
                case 'proto':
                    let cStrP = me.dynamic["codes"].join(":");
                    nObj.setAttribute("code",cStrP);
                    let midCont = "";
                    let sideCont = ["",""];
                    let tailCont = "";
                    let mouthCont = "";
                    if ("codes" in me.dynamic) {
                        if ((me.dynamic["codes"].includes("aab") || me.dynamic["codes"].includes("aac")) && me.dynamic["codes"].includes("aad")) {
                            nObj.classList.add("breather");
                            midCont += "&Colon;";
                            //midCont += "&ratio;";
                        }
                        if (me.dynamic["codes"].includes("bba") && me.dynamic["codes"].includes("bbc")) {
                            nObj.classList.add("eater");
                            //midCont += "&hercon;";
                            mouthCont = "<div class=\"mouth\"><span class=\"open\">&sum;</span><span class=\"closed\">O</span><div>";
                        }
                        if (me.dynamic["codes"].includes("aaa") && me.dynamic["codes"].includes("bbb")) {
                            nObj.classList.add("mover");
                            //midCont += "&sc;";
                            tailCont = "<div class=\"tail mv-tail mv-animation\">&sim;</div>"; // &bsim;
                        }
                        if (me.dynamic["codes"].includes("bab") && me.dynamic["codes"].includes("bac")) {
                            nObj.classList.add("chem");
                            midCont += "&divonx;";
                        }
                    }
                    if (midCont.length == 0) midCont = "&horbar;"; //"&minus;";

                    pHTML = "<div class=\"back\">";
                    pHTML += tailCont;
                    pHTML += "</div>";
                    pHTML += "<div class=\"mid\">";
                    pHTML += "<div class=\"main\">" + midCont + "</div>";
                    pHTML += "</div>";
                    pHTML += "<div class=\"front\">";
                    pHTML += mouthCont;
                    pHTML += "</div>";

                    nCont = pHTML;
                    //me.pos.dir = Math.floor(Math.random() * 360);
                    nObj.style.transform = "translateX(-50%) translateY(-50%) rotate(" + me.pos.dir + "deg)";
                    break;
            }
            nObj.innerHTML = nCont;
            nObj.setAttribute("px", me.pos.x);
            nObj.setAttribute("py", me.pos.y);
            nObj.setAttribute("gen", me.gen);
            if (me.active) nObj.setAttribute("istat", "active");
            else nObj.setAttribute("istat", "inactive");

            me.obj = nObj;

            me.pos.pID = me.id;
            me.pos.pType = me.ops.type;

            if (me.active) {
                me.obj.style.left = me.pos.x + "px";
                me.obj.style.top = me.pos.y + "px";
                me.obj.style.transform = me.transformFill.replace("***",me.pos.dir); //"z " + proto.pos.dir + "deg";
            }
        }
    };

    if (ops != undefined && ops != null) {
        me.ops = ops;
    }

    if (init) me.init();
}
