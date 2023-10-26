export * from "./Descriptor";
export { default as BuffDescriptor } from "./Buff";
export { default as CardDescriptor } from "./Card";
export { default as FuncDescriptor } from "./Func";
export { default as ItemDescriptor } from "./Item";
export { default as SkillDescriptor } from "./Skill";
export { default as TraitDescriptor } from "./Trait";
export { toTitleCase } from "./Helpers";

export enum UILanguage {
    EN_US = "en-US",
    ID_ID = "id-ID",
    ZH_CN = "zh-CN",
    ZH_TW = "zh-TW",
    JA_JP = "ja-JP",
    KO_KR = "ko-KR",
}
