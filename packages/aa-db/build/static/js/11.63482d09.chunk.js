(this["webpackJsonpaa-db"]=this["webpackJsonpaa-db"]||[]).push([[11],{112:function(e,a,t){"use strict";var n;!function(e){e.SABER="saber",e.ARCHER="archer",e.LANCER="lancer",e.RIDER="rider",e.CASTER="caster",e.ASSASSIN="assassin",e.BERSERKER="berserker",e.SHIELDER="shielder",e.RULER="ruler",e.ALTER_EGO="alterEgo",e.AVENGER="avenger",e.GRAND_CASTER="grandCaster",e.BEAST_II="beastII",e.BEAST_I="beastI",e.MOON_CANCER="moonCancer",e.BEAST_IIIR="beastIIIR",e.FOREIGNER="foreigner",e.BEAST_IIIL="beastIIIL",e.BEAST_UNKNOWN="beastUnknown",e.ALL="ALL",e.EXTRA="EXTRA"}(n||(n={})),a.a=n},116:function(e,a,t){"use strict";var n=t(10),r=t(11),s=t(18),c=t(17),l=t(0),i=t.n(l),o=t(112),u=new Map([[0,0],[1,1],[2,1],[3,2],[4,3],[5,3]]),E=new Map([[o.a.SABER,1],[o.a.ARCHER,2],[o.a.LANCER,3],[o.a.RIDER,4],[o.a.CASTER,5],[o.a.ASSASSIN,6],[o.a.BERSERKER,7],[o.a.SHIELDER,8],[o.a.RULER,9],[o.a.ALTER_EGO,10],[o.a.AVENGER,11],[o.a.MOON_CANCER,23],[o.a.FOREIGNER,25],[o.a.GRAND_CASTER,5],[o.a.BEAST_I,20],[o.a.BEAST_II,20],[o.a.BEAST_IIIL,20],[o.a.BEAST_IIIR,20],[o.a.BEAST_UNKNOWN,20],[o.a.ALL,1001],[o.a.EXTRA,1002]]),p=function(e){Object(s.a)(t,e);var a=Object(c.a)(t);function t(){return Object(n.a)(this,t),a.apply(this,arguments)}return Object(r.a)(t,[{key:"render",value:function(){var e;return i.a.createElement("img",{alt:"",src:this.location(),style:{height:null!==(e=this.props.height)&&void 0!==e?e:24}})}},{key:"location",value:function(){var e,a=E.has(this.props.className)?E.get(this.props.className):12,t=null!==(e=this.props.rarity)&&void 0!==e?e:5,n=u.has(t)?u.get(t):3;return"https://assets.atlasacademy.io/GameData/NA/ClassIcons/class".concat(n,"_").concat(a,".png")}}]),t}(i.a.Component);a.a=p},124:function(e,a,t){"use strict";var n=t(1),r=t(2),s=t(4),c=t.n(s),l=t(0),i=t.n(l),o=t(5),u=["xl","lg","md","sm","xs"],E=i.a.forwardRef((function(e,a){var t=e.bsPrefix,s=e.className,l=e.noGutters,E=e.as,p=void 0===E?"div":E,m=Object(r.a)(e,["bsPrefix","className","noGutters","as"]),h=Object(o.b)(t,"row"),v=h+"-cols",f=[];return u.forEach((function(e){var a,t=m[e];delete m[e];var n="xs"!==e?"-"+e:"";null!=(a=null!=t&&"object"===typeof t?t.cols:t)&&f.push(""+v+n+"-"+a)})),i.a.createElement(p,Object(n.a)({ref:a},m,{className:c.a.apply(void 0,[s,h,l&&"no-gutters"].concat(f))}))}));E.displayName="Row",E.defaultProps={noGutters:!1},a.a=E},127:function(e,a,t){"use strict";var n=t(10),r=t(11),s=t(18),c=t(17),l=t(0),i=t.n(l),o=t(129),u=t(101),E=t(103),p=t(106),m=function(e){Object(s.a)(t,e);var a=Object(c.a)(t);function t(){return Object(n.a)(this,t),a.apply(this,arguments)}return Object(r.a)(t,[{key:"render",value:function(){var e,a=this,t=this.props.func;return i.a.createElement(u.a,{data:{Raw:i.a.createElement(E.a,{data:t}),ID:t.funcId,Type:t.funcType,Target:t.funcTargetType,"Affects Players/Enemies":t.funcTargetTeam,"Popup Text":t.funcPopupText,"Target Traits":i.a.createElement("div",null,t.functvals.map((function(e,t){return i.a.createElement(p.a,{key:t,region:a.props.region,trait:e})}))),"Affects Traits":i.a.createElement("div",null,null===(e=t.traitVals)||void 0===e?void 0:e.map((function(e,t){return i.a.createElement(p.a,{key:t,region:a.props.region,trait:e})}))),Buffs:i.a.createElement("div",null,t.buffs.map((function(e,t){return i.a.createElement(o.a,{key:t,region:a.props.region,buff:e})})))}})}}]),t}(i.a.Component);a.a=m},138:function(e,a,t){"use strict";var n;!function(e){e.NORMAL="normal",e.HEROINE="heroine",e.COMBINE_MATERIAL="combineMaterial",e.ENEMY="enemy",e.ENEMY_COLLECTION="enemyCollection",e.SERVANT_EQUIP="servantEquip",e.STATUS_UP="statusUp",e.SVT_EQUIP_MATERIAL="svtEquipMaterial",e.ENEMY_COLLECTION_DETAIL="enemyCollectionDetail",e.ALL="all",e.COMMAND_CODE="commandCode"}(n||(n={})),a.a=n},139:function(e,a,t){"use strict";var n=t(10),r=t(11),s=t(18),c=t(17),l=t(0),i=t.n(l),o=t(22),u=t(116),E=function(e){Object(s.a)(t,e);var a=Object(c.a)(t);function t(){return Object(n.a)(this,t),a.apply(this,arguments)}return Object(r.a)(t,[{key:"render",value:function(){return i.a.createElement(o.b,{to:"/".concat(this.props.region,"/servant/").concat(this.props.servant.id)},i.a.createElement(u.a,{className:this.props.servant.className,rarity:this.props.servant.rarity,height:this.props.iconHeight})," ",this.props.servant.name)}}]),t}(i.a.Component);a.a=E},140:function(e,a,t){"use strict";var n=t(118),r=t(10),s=t(11),c=t(18),l=t(17),i=t(0),o=t.n(i),u=t(101),E=t(103),p=function(e){Object(c.a)(t,e);var a=Object(l.a)(t);function t(){return Object(r.a)(this,t),a.apply(this,arguments)}return Object(s.a)(t,[{key:"render",value:function(){return o.a.createElement(u.a,{data:Object(n.a)({Raw:o.a.createElement(E.a,{data:this.props.dataVal})},this.props.dataVal)})}}]),t}(o.a.Component);a.a=p},192:function(e,a,t){"use strict";t.r(a);var n=t(99),r=t.n(n),s=t(100),c=t(10),l=t(11),i=t(18),o=t(17),u=t(0),E=t.n(u),p=t(124),m=t(64),h=t(95),v=t(98),f=t(138),d=t(101),R=t(53),b=t(12),g=t(103),O=t(139),A=t(117),I=t(119),y=t(140),N=t(127),T=function(e){Object(i.a)(t,e);var a=Object(o.a)(t);function t(){return Object(c.a)(this,t),a.apply(this,arguments)}return Object(l.a)(t,[{key:"render",value:function(){var e=this;return E.a.createElement("div",null,this.props.noblePhantasm.functions.map((function(a,t){var n=Object(I.g)(a,e.props.level,e.props.overcharge);return E.a.createElement("div",{key:t},E.a.createElement("h3",null,"Effect #",t+1),E.a.createElement("p",null,E.a.createElement(A.a,{region:e.props.region,func:a,level:e.props.level,overcharge:e.props.overcharge})),E.a.createElement(p.a,null,E.a.createElement(m.a,{xs:12,md:6},E.a.createElement("h5",null,"Function"),E.a.createElement(N.a,{region:e.props.region,func:a})),E.a.createElement(m.a,{xs:12,md:6},E.a.createElement("h5",null,"Values"),E.a.createElement(y.a,{dataVal:null!==n&&void 0!==n?n:{}}))),E.a.createElement("hr",null))})))}}]),t}(E.a.Component),C=function(e){Object(i.a)(t,e);var a=Object(o.a)(t);function t(e){var n;return Object(c.a)(this,t),(n=a.call(this,e)).state={loading:!0,level:1,overcharge:1},n}return Object(l.a)(t,[{key:"componentDidMount",value:function(){this.loadNp()}},{key:"loadNp",value:function(){var e=Object(s.a)(r.a.mark((function e(){var a;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,v.a.noblePhantasm(this.props.region,this.props.id);case 3:a=e.sent,this.setState({loading:!1,noblePhantasm:a}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),this.setState({error:e.t0});case 10:case"end":return e.stop()}}),e,this,[[0,7]])})));return function(){return e.apply(this,arguments)}}()},{key:"changeLevel",value:function(e){this.setState({level:e})}},{key:"changeOvercharge",value:function(e){this.setState({overcharge:e})}},{key:"render",value:function(){var e=this;if(this.state.error)return E.a.createElement(R.a,{error:this.state.error});if(this.state.loading||!this.state.noblePhantasm)return E.a.createElement(b.a,null);var a=this.state.noblePhantasm;return E.a.createElement("div",null,E.a.createElement("h1",null,a.name),E.a.createElement("br",null),E.a.createElement(d.a,{data:{Raw:E.a.createElement(g.a,{data:a}),ID:a.id,Name:a.name,Type:a.type,Rank:a.rank,Detail:a.detail,"Card Type":a.card,Owner:E.a.createElement("div",null,a.reverseServants.filter((function(e){return e.type===f.a.NORMAL||e.type===f.a.HEROINE})).map((function(a,t){return E.a.createElement("div",null,E.a.createElement(O.a,{region:e.props.region,servant:a,iconHeight:24}))})))}}),E.a.createElement("br",null),E.a.createElement(p.a,null,E.a.createElement(m.a,null,E.a.createElement(h.a,{inline:!0,style:{justifyContent:"flex-end"}},E.a.createElement(h.a.Control,{as:"select",value:this.state.level,onChange:function(a){return e.changeLevel(parseInt(a.target.value))}},[1,2,3,4,5].map((function(e){return E.a.createElement("option",{key:e,value:e},"NP LEVEL ",e)}))))),E.a.createElement(m.a,null,E.a.createElement(h.a,{inline:!0},E.a.createElement(h.a.Control,{as:"select",value:this.state.overcharge,onChange:function(a){return e.changeOvercharge(parseInt(a.target.value))}},[1,2,3,4,5].map((function(e){return E.a.createElement("option",{key:e,value:e},"OVERCHARGE ",e)})))))),E.a.createElement("br",null),E.a.createElement(T,{region:this.props.region,noblePhantasm:a,level:this.state.level,overcharge:this.state.overcharge}))}}]),t}(E.a.Component);a.default=C}}]);
//# sourceMappingURL=11.63482d09.chunk.js.map