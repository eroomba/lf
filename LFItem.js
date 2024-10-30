function LFItem(pos, core, dynamicInit=null, initOps = {init: true}) {
    let me = this;
    me.id = lf.generateID();
    me.gen = lf.step;
    me.active = true;
    me.obj = null;
    me.pos = pos;
    me.life = 0;
    me.hash = "";
    me.core = core;
    me.dynamic = new LFDynamic(dynamicInit);
    me.complex = 0;
    me.parent = dynamicInit != null && "parent" in dynamicInit ? dynamicInit["parent"] : null;
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
                    let sCode = me.dynamic.codes[0];
                    nObj.setAttribute("scode", sCode);
                    nObj.classList.add("snip-" + sCode);
                    break;
                case 'strand':
                    let cStrS = me.dynamic.codes.join(":");
                    nObj.setAttribute("code",cStrS);
                    nCont = me.core.content;
                    let cLen = me.dynamic.codes.length;
                    if (cLen >= gVars.minStrandLen) {  nObj.classList.add("sz-full"); }
                    else if (cLen >= Math.floor(gVars.minStrandLen / 2)) {nObj.classList.add("sz-mid"); }
                    break;
                case 'struck':
                    if (me.core.subtype == "struckHusk") {
                        let hHTML = "<div class=\"mid\">";
                        hHTML += "<div class=\"main\"><div class=\"core\">&nbsp;</div></div>";
                        hHTML += "</div>";
                        nCont = hHTML;
                        nObj.classList.add(me.dynamic.mem["type"]);
                    }
                    else nCont = me.core.content;
                    break;
                case 'proto':
                    let cStrP = ":" + me.dynamic.codes.join(":") + ":";
                    nObj.setAttribute("code",cStrP);
                    let midCont = "";
                    let backCont = "";
                    let frontCont = "";
                    let mainClasses = [];

                    let pTypes = lf.behaviors.getTypes(me.dynamic.codes);

                    if (pTypes.includes("move")) {
                        nObj.classList.add("mover");
                        backCont = "<div class=\"tail mv-tail mv-animation\">&sim;</div>";
                    }

                    if (pTypes.includes("chem")) {
                        nObj.classList.add("chem");
                    }

                    if (pTypes.includes("eat")) {
                        nObj.classList.add("eater");
                        frontCont = "<div class=\"mouth\"><span class=\"open\">&sum;</span><span class=\"closed\">O</span><div>";
                    }

                    if (pTypes.includes("breathe")) {
                        nObj.classList.add("breather");
                        if (cStrP.indexOf(":aab:") >= 0) midCont += "&mDDot;"
                        else midCont += "&divide;"; //"&Colon;"
                    }

                    if (midCont.length == 0) midCont = "&minus;";

                    pHTML = "<div class=\"back\">" + backCont + "</div>";
                    pHTML += "<div class=\"mid\">";
                    pHTML += "<div class=\"main chem-pip\"><div class=\"core breath-pip\">" + midCont + "</div></div>";
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
