function LFItemCore(init = {}) {
    const setup = {
            type = "none", 
            subtype = "none",
            iclass = "",
            weight = 0,
            data = null,
            content = "",
            formula = () => { return null; },
            range = 0,
            decay = null,
            dformula = [] } = init;
    let me = this;
    me.type = type;
    me.subtype = subtype;
    me.iclass = iclass;
    me.weight = weight;
    me.data = data; 
    me.content = content;
    me.formula = formula
    me.range = range; 
    me.decay = decay; 
    me.dformula = dformula; 
}

function LFItem(pos, core, dynamicInit=null, initOps = {init: true}) {
    let me = this;
    me.id = lf.generateID() + "-" + core.type;
    me.gen = lf.step;
    me.active = true;
    me.obj = null;
    me.pos = pos;
    me.life = 0;
    me.maxlife = 0;
    me.hash = "";
    me.core = core;
    me.dynamic = new LFDynamic(dynamicInit);
    me.complex = 0;
    me.age = 0;
    me.debug = "type=" + me.core.type + ",subtype=" + me.core.subtype + ";";
    me.parent = dynamicInit != null && "parent" in dynamicInit ? dynamicInit["parent"] : null;
    if ("complex" in initOps) me.complex = initOps["complex"];
    me.transformFill = "translateX(-50%) translateY(-50%) rotate(***deg)";

    me.update = () => {
        me.age++;
        if (me.active) {
            lfcore[me.core.type].update(me);
        }

        me.obj.setAttribute("x", me.pos.x);
        me.obj.setAttribute("y", me.pos.y);
        me.obj.setAttribute("dir", me.pos.dir);
        me.obj.setAttribute("vel", me.pos.vel);

        if (lf.marker.track != null && lf.marker.track == me.id) {
            lf.marker.obj.style.left = me.obj.style.left;
            lf.marker.obj.style.top = me.obj.style.top;
        }
        if (lf.dbhr.track != null && lf.dbhr.track == me.id) {
            lf.dbhr.obj.style.left = me.obj.style.left;
            lf.dbhr.obj.style.top = me.obj.style.top;
        }
    };
    me.deactivate = () => {
        me.active = false;
    };
    me.init = () => {
        if (me.core != undefined && me.core != null) {
            me.maxlife = me.core.decay;
            me.life = me.maxlife;
        }

        if (me.pos == null || me.core == undefined || me.core == null) {
            me.debug += "da-no-core;";
            me.deactivate();
        }
        else {
            let nObj = document.createElement("div");
            nObj.id = me.id;
            nObj.style.left = me.pos.x + "px";
            nObj.style.top = me.pos.y + "px";
            nObj.classList.add(me.core.type);
            if (me.core.iclass.length > 0) nObj.classList.add(me.core.iclass);
            let nCont = "[]";
            switch (me.core.type) {
                case 'snip':
                    nCont =  me.core.content;
                    let sCode = me.dynamic.codes[0];
                    nObj.setAttribute("scode", sCode);
                    nObj.classList.add("snip-" + sCode);
                    if (sCode.indexOf("u") >= 0) nObj.classList.add("snip-u");
                    break;
                case 'strand':
                    let cStrS = me.dynamic.codes.join(":");
                    nObj.setAttribute("code",cStrS);
                    nCont = me.core.content;
                    let cLen = me.dynamic.codes.length;

                    if (me.core.subtype == "strandD") {
                        if (cLen >= gVars.minStrandLen) {  nObj.classList.add("sz-full"); }
                        else if (cLen >= Math.floor(gVars.minStrandLen / 2)) {nObj.classList.add("sz-mid"); }
                    }
                    else if (me.core.subtype == "strandV") {
                        let vTypes = lf.behaviors.getTypes(me.dynamic.codes);
                        if (vTypes.includes("v2")) {
                            me.dynamic.mem["v-type"] = "v2";
                            nCont = "&Vdash;";
                        }
                        else if (vTypes.includes("v3")) {
                            me.dynamic.mem["v-type"] = "v3";
                            nCont = "&Vvdash;";
                        }
                        else if (vTypes.includes("v4")) {
                            me.dynamic.mem["v-type"] = "v4";
                            nCont = "&VDash;";
                        }
                        else me.dynamic.mem["v-type"] = "v";

                        if (!nObj.classList.contains("strand-" + me.dynamic.mem["v-type"])) nObj.classList.add("strand-" + me.dynamic.mem["v-type"]);
                    }
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

                    if (pTypes.includes("chem") && me.complex == 1) {
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

                    switch (me.core.subtype) {
                        case "protoC":
                            me.life = Math.floor(me.maxlife * 0.6);
                            break;
                        default:
                            me.life = Math.floor(me.maxlife * 0.5);
                            break;
                    }

                    break;
                default:
                    nCont = me.core.content;
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

            if (me.obj.style.opacity != undefined && me.obj.style.opacity != null)
                me.obj.setAttribute("oop", me.obj.style.opacity);

            if (me.active) {
                me.obj.style.left = me.pos.x + "px";
                me.obj.style.top = me.pos.y + "px";
                me.obj.style.transform = me.transformFill.replace("***",me.pos.dir); //"z " + proto.pos.dir + "deg";
            }
        }
    };

    if ("init" in initOps && initOps.init) me.init();
}
