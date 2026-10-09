/* Editorial depth fixes: avoid shallow circular definitions in the embedded glossary. */
(()=>{
 const fixes={"echino":"真菌の細胞壁ではβ-1,3-グルカンが合成され、細胞外へ組み込まれて形と強度を保つ。ヒト細胞には同じ細胞壁がない。","granuloma":"正常な免疫応答では侵入した微生物を貪食細胞が処理し、T細胞の合図を受けて感染局所の反応を調節する。","anatomy_meninges":"髄膜は脳と脊髄を物理的に包み、くも膜下腔を流れる髄液は衝撃を緩和し、神経組織の周囲の環境を保つ。","ureter":"正常の尿は腎臓から腎盂・尿管・膀胱・尿道へ一方向に流れる。尿流と排尿は尿路へ侵入した微生物の排出に役立つ。","mycolic":"結核菌の正常な細胞壁にはミコール酸などの脂質性成分が多く存在し、その層が外界からの物質の通過を制限する。","pneumocystis":"正常ではCD4陽性T細胞などが肺の免疫応答を支え、ニューモシスチスの異常な増殖と肺胞の炎症を抑える。","ivermectin":"線虫の神経や筋の細胞膜では、イオンチャネルを介したCl⁻などの移動が膜電位を調節し、興奮と抑制のバランスを保つ。","praziquantel":"寄生虫の筋細胞はCa²⁺の濃度変化を使って収縮を調節し、消化管への付着や移動など生存に必要な動きを行う。","ha":"インフルエンザウイルスはHAで宿主細胞表面のシアル酸に結合して侵入し、細胞内でゲノム複製と粒子形成を進める。"};
 for(const term of window.INFECT_TERM_ENTRIES||[]){if(fixes[term.id])term.normal=fixes[term.id];}
})();
