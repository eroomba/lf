function LFItem(pos, core, dynamic = {}, genetic = {}, initOps = {init: true}) {
    let me = this;
    me.id = lf.generateID();
    me.gen = -1;
    me.active = true;
    me.obj = null;
    me.pos = pos;
    me.life = 0;
    me.hash = "";
    me.core = core;
    me.dynamic = dynamic;
    me.genetic = genetic;
    me.complex = 0;
    if ("complex" in initOps) me.complex = initOps["complex"];
    me.transformFill = "translateX(-50%) translateY(-50%) rotate(***deg)";
    me.update = () => {
        if (me.active) {
            lfcore[me.core.type].update(me);
        }

        me.obj.setAttribute("x", me.pos.x);
        me.obj.setAttribute("y", me.pos.y);
        me.obj.setAttribute("dir", me.pos.dir);
        me.obj.setAttribute("vel", me.pos.vel);
    };
    me.deactivate = () => {
        me.active = false;
    };
    me.init = () => {
        if (me.core != undefined && me.core != null) {
            me.life = me.core.decay;
        }

        if (me.pos == null || me.core == undefined || me.core == null) {
            me.deactivate();
        }
        else {
            if (dynamic["gen"] != undefined && dynamic["gen"] != null)
                me.gen = dynamic["gen"];
            let nObj = document.createElement("div");
            nObj.id = me.id;
            nObj.style.left = me.pos.x + "px";
            nObj.style.top = me.pos.y + "px";
            nObj.classList.add(me.core.type);
            nObj.classList.add(me.core.class);
            let nCont = "[]";
            switch (me.core.type) {
                case 'spek':
                    nCont = me.core.content;
                    break;
                case 'ort':
                    nCont = me.core.content;
                    break;
                case 'snip':
                    nCont =  me.core.content;
                    let sCode = me.dynamic["code"];
                    nObj.setAttribute("scode", sCode);
                    nObj.classList.add("snip-" + sCode);
                    break;
                case 'strand':
                    let cStrS = me.dynamic["codes"].join(":");
                    nObj.setAttribute("code",cStrS);
                    nCont = me.core.content;
                    let cLen = me.dynamic["codes"].length;
                    if (cLen >= gVars.minStrandLen) nObj.classList.add("sz-full");
                    else nObj.classList.add("sz-" + me.dynamic["codes"].length);
                    break;
                case 'struck':
                    nCont = me.core.content;
                    break;
                case 'proto':
                    let cStrP = ":" + me.dynamic["codes"].join(":") + ":";
                    nObj.setAttribute("code",cStrP);
                    let midCont = "";
                    let backCont = "";
                    let frontCont = "";
                    let mainClasses = [];

                    if (cStrP.indexOf(":aaa:") >= 0 && cStrP.indexOf(":bbb:") >= 0) {
                        nObj.classList.add("mover");
                        backCont = "<div class=\"tail mv-tail mv-animation\">&sim;</div>";
                    }

                    if (cStrP.indexOf(":bab:") >= 0 && cStrP.indexOf(":bac:") >= 0) {
                        nObj.classList.add("chem");
                        if (me.complex >= 2) {
                            midCont += "<div class=\"core chem-pip\">&divonx;</div>";
                        }
                        else if (me.complex == 1) {
                            mainClasses.push("chem-pip");
                        }
                    }

                    if (cStrP.indexOf(":bba:") >= 0 && cStrP.indexOf(":bbc:") >= 0) {
                        nObj.classList.add("eater");
                        frontCont = "<div class=\"mouth\"><span class=\"open\">&sum;</span><span class=\"closed\">O</span><div>";
                    }

                    if (cStrP.indexOf(":aad:") >= 0 && (cStrP.indexOf(":aab:") >= 0 || cStrP.indexOf(":aac:") >= 0)) {
                        nObj.classList.add("breather");
                        midCont += "<div class=\"core breath-pip\">&Colon;</div>"
                    }

                    if (midCont.length == 0) midCont = "<div class=\"core " + mainClasses.join(" ") + "\">&horbar;</div>";

                    pHTML = "<div class=\"back\">" + backCont + "</div>";
                    pHTML += "<div class=\"mid\">";
                    pHTML += "<div class=\"main\">" + midCont + "</div>";
                    pHTML += "</div>";
                    pHTML += "<div class=\"front\">" + frontCont + "</div>";

                    nCont = pHTML;

                    break;
            }
            nObj.innerHTML = nCont;
            nObj.setAttribute("px", me.pos.x);
            nObj.setAttribute("py", me.pos.y);
            nObj.setAttribute("gen", me.gen);
            if (me.active) nObj.setAttribute("istat", "active");
            else nObj.setAttribute("istat", "inactive");
            nObj.classList.add("complex-" + me.complex);

            me.obj = nObj;

            me.pos.pID = me.id;
            me.pos.pType = me.core.type;

            if (me.active) {
                me.obj.style.left = me.pos.x + "px";
                me.obj.style.top = me.pos.y + "px";
                me.obj.style.transform = me.transformFill.replace("***",me.pos.dir); //"z " + proto.pos.dir + "deg";
            }
        }
    };

    if ("init" in initOps && initOps.init) me.init();
}
