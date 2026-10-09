/* Tested but previously unexplained molecular, diagnostic and pharmacologic terms */
window.INFECT_TERM_ENTRIES=(window.INFECT_TERM_ENTRIES||[]).concat([
  {
    "id": "daa",
    "title": "DAA",
    "aliases": [
      "DAA",
      "直接作用型抗ウイルス薬"
    ],
    "what": "HCVが増えるために必要なウイルスタンパク質へ直接作用する薬の総称。標的にはNS3/4A・NS5A・NS5Bがある。",
    "normal": "HCVは自身のRNAからウイルスタンパクを作り、切断・複製・組み立てを経て増殖する。",
    "why": "複数の異なる標的を阻害する薬剤を組み合わせることで、HCV排除を目指せる。HBVの核酸アナログ治療とは異なる。",
    "related": [
      "hcv",
      "ns3",
      "ns5a",
      "ns5b"
    ]
  },
  {
    "id": "ns3",
    "title": "NS3/4A",
    "aliases": [
      "NS3/4A",
      "NS3/4Aプロテアーゼ"
    ],
    "what": "HCVが合成した大きなポリタンパク質を機能するタンパクへ切断するウイルスの酵素複合体。",
    "normal": "タンパク質の長い鎖が適切な部分で切断されることで、HCV増殖の装置が働けるようになる。",
    "why": "NS3/4Aプロテアーゼ阻害薬はウイルスタンパクの成熟を止める。重症肝障害で使えない薬もあり注意が必要。",
    "related": [
      "daa",
      "hcv"
    ]
  },
  {
    "id": "ns5a",
    "title": "NS5A",
    "aliases": [
      "NS5A"
    ],
    "what": "HCVのRNA複製複合体の形成やウイルス粒子組み立てなどに関わる非構造タンパク質。",
    "normal": "HCVは宿主細胞内の膜構造などを利用し、複製に必要なタンパク質を組織化する。",
    "why": "NS5A阻害薬はその複製関連過程を妨げ、他の作用点のDAAと組み合わせる。",
    "related": [
      "daa",
      "hcv"
    ]
  },
  {
    "id": "ns5b",
    "title": "NS5B",
    "aliases": [
      "NS5B"
    ],
    "what": "HCVがRNAを複製するRNA依存性RNAポリメラーゼ。既存のRNA鎖を鋳型に新しいウイルスRNAを合成する。",
    "normal": "HCVは増殖時にRNAゲノムを多数コピーしなければならない。",
    "why": "NS5Bを阻害する薬はRNA合成を妨げる。DNA合成阻害薬とは標的となる酵素の種類が違う。",
    "related": [
      "daa",
      "dna_poly",
      "hcv"
    ]
  },
  {
    "id": "cccDNA",
    "title": "cccDNA",
    "aliases": [
      "cccDNA",
      "共有結合閉環状DNA"
    ],
    "what": "B型肝炎ウイルスが感染肝細胞の核内に保持する環状DNAで、ウイルスRNAの鋳型となる。",
    "normal": "感染した肝細胞はcccDNAからRNAを作り、ウイルス複製やタンパク質産生を続けうる。",
    "why": "核酸アナログでHBVの複製を抑えてもcccDNAを通常完全には除去できず、HCV治療と違い長期抑制が重要となる。",
    "related": [
      "hbv",
      "rt",
      "dnarna"
    ]
  },
  {
    "id": "hepatitis_serology",
    "title": "HBs抗原",
    "aliases": [
      "HBs抗原",
      "HBs抗体",
      "HBc抗体",
      "HBV DNA",
      "HCV RNA"
    ],
    "what": "ウイルス性肝炎の状態を調べるマーカー。HBs抗原はHBV感染、抗体は免疫応答・感染歴、ウイルスDNA/RNAは核酸を検出する。",
    "normal": "感染前やワクチン接種後、感染後回復期では抗原・抗体の組合せが異なる。",
    "why": "HBs抗原やHBV DNAは感染状態、HBc抗体は自然感染歴の解釈などに利用する。HCV抗体陽性だけでは活動性感染を証明できない。",
    "related": [
      "hbv",
      "hcv",
      "antibody",
      "test"
    ]
  },
  {
    "id": "mrna",
    "title": "mRNA",
    "aliases": [
      "mRNA",
      "メッセンジャーRNA"
    ],
    "what": "DNA等の遺伝情報をタンパク質合成装置へ伝えるRNA。塩基配列を3つずつ読み、アミノ酸配列の情報として使う。",
    "normal": "細胞ではDNAから転写されたmRNAをリボソームが読み、必要なタンパク質を作る。",
    "why": "マクロライド等は細菌の翻訳を、バロキサビルはインフルエンザのmRNA合成に関わる過程を妨げる。",
    "related": [
      "dnarna",
      "ribosome",
      "trna"
    ]
  },
  {
    "id": "rrna",
    "title": "rRNA",
    "aliases": [
      "rRNA",
      "リボソームRNA",
      "16S rRNA"
    ],
    "what": "リボソームを構成するRNAで、タンパク質とともに翻訳装置の骨格や機能を担う。16S rRNAは細菌の同定にも用いられる。",
    "normal": "細菌の30SサブユニットなどではrRNAが構造の中心となり、mRNAの読み取りに関わる。",
    "why": "rRNAの配列や修飾によって抗菌薬の結合性が変わる場合があり、薬剤耐性につながる。",
    "related": [
      "ribosome",
      "dnarna"
    ]
  },
  {
    "id": "paba",
    "title": "PABA",
    "aliases": [
      "PABA",
      "パラアミノ安息香酸",
      "ジヒドロ葉酸還元酵素",
      "DHFR"
    ],
    "what": "PABAは多くの細菌が葉酸を合成する際の材料。DHFRは葉酸を還元型へ変換する酵素。",
    "normal": "細菌は葉酸誘導体を利用してDNA合成に必要なヌクレオチドを作る。",
    "why": "スルホンアミドはPABAを使う工程、トリメトプリムはDHFRを阻害し、二段階で葉酸代謝を抑える。",
    "related": [
      "st_combination",
      "dnarna"
    ]
  },
  {
    "id": "nlp",
    "title": "プロテアーゼ",
    "aliases": [
      "プロテアーゼ",
      "ウイルスプロテアーゼ"
    ],
    "what": "タンパク質のペプチド結合を切断する酵素。ウイルスでは長いポリタンパクを機能単位に分ける働きがある。",
    "normal": "新しく作ったタンパクは、正しい形への成熟や切断によって機能することがある。",
    "why": "HIV・HCV・SARS-CoV-2などのプロテアーゼ阻害薬はウイルス粒子の成熟や複製装置形成を妨げる。",
    "related": [
      "virus",
      "hiv",
      "hcv"
    ]
  },
  {
    "id": "cap_snatch",
    "title": "キャップ依存性エンドヌクレアーゼ",
    "aliases": [
      "キャップ依存性エンドヌクレアーゼ",
      "cap-snatching",
      "バロキサビル"
    ],
    "what": "インフルエンザウイルスが宿主mRNAの5′キャップ付き断片を利用して、自分のmRNA合成を開始する仕組みに関わる酵素。",
    "normal": "宿主細胞はmRNAの5′キャップを利用して安定性や翻訳を調節する。",
    "why": "バロキサビルはウイルスのキャップ依存性エンドヌクレアーゼを阻害し、mRNA合成を妨げる。",
    "related": [
      "virus",
      "mrna",
      "na"
    ]
  },
  {
    "id": "nrtis",
    "title": "NRTI",
    "aliases": [
      "NRTI",
      "NtRTI",
      "NNRTI"
    ],
    "what": "HIVの逆転写酵素阻害薬の分類。NRTI/NtRTIは核酸の材料に似た薬、NNRTIは酵素の別の場所に結合する薬。",
    "normal": "逆転写酵素はウイルスRNAを鋳型にDNAを伸ばして作る。",
    "why": "NRTI/NtRTIはDNA鎖伸長を妨げ、NNRTIは酵素活性を抑える。併用療法では耐性・相互作用も考慮する。",
    "related": [
      "rt",
      "hiv",
      "dnarna"
    ]
  },
  {
    "id": "aids",
    "title": "AIDS",
    "aliases": [
      "AIDS",
      "後天性免疫不全症候群"
    ],
    "what": "HIV感染により細胞性免疫などが著しく障害され、特定の日和見疾患などの基準を満たす状態。",
    "normal": "正常なCD4陽性T細胞は免疫細胞の調整役として病原体制御を助ける。",
    "why": "HIV感染者が全員AIDSなのではない。進行するとニューモシスチス肺炎・トキソプラズマ脳炎などが増える。",
    "related": [
      "hiv",
      "tcell",
      "pneumocystis"
    ]
  },
  {
    "id": "iris",
    "title": "IRIS",
    "aliases": [
      "IRIS",
      "免疫再構築症候群"
    ],
    "what": "HIV治療開始後など、免疫機能が回復していく過程で既存の感染症や抗原に対する炎症反応が強くなる現象。",
    "normal": "免疫機能の回復により、本来は病原体を排除する反応が再び働く。",
    "why": "ウイルス量が減っても一時的に症状が悪化する場合があり、感染症の治療失敗・薬剤副作用と鑑別する。",
    "related": [
      "aids",
      "hiv",
      "cytokine"
    ]
  },
  {
    "id": "p24",
    "title": "p24抗原",
    "aliases": [
      "p24抗原",
      "HIV抗原抗体検査"
    ],
    "what": "HIVのカプシドを構成するp24タンパクなどを測る検査。抗原抗体同時検査ではHIVへの抗体も評価する。",
    "normal": "感染後の時期でウイルス抗原量と抗体産生の程度が変化する。",
    "why": "検査のウインドウ期や確認検査の必要性を考える。単独検査結果だけで感染時期・病期を断定しない。",
    "related": [
      "hiv",
      "antibody",
      "test"
    ]
  },
  {
    "id": "pcr_quant",
    "title": "ウイルス量",
    "aliases": [
      "ウイルス量",
      "viral load",
      "ウイルスRNA量"
    ],
    "what": "血液などの検体に存在するウイルス核酸量を測った値。HIV・HBV・HCV等の治療効果判定に用いる。",
    "normal": "ウイルス増殖と排除の均衡によって検体中の核酸量が変化する。",
    "why": "量の変化は治療効果の目安になるが、抗体や抗原とは別の測定対象。検査法・検体・時期に注意する。",
    "related": [
      "test",
      "dnarna",
      "hiv"
    ]
  },
  {
    "id": "sofa",
    "title": "SOFA",
    "aliases": [
      "SOFA",
      "qSOFA"
    ],
    "what": "臓器障害を評価するSOFAスコアと、臨床現場で敗血症リスクを素早く把握する補助指標qSOFA。",
    "normal": "正常時には意識・呼吸・循環・腎機能・血小板などの臓器機能が保たれる。",
    "why": "感染時の意識変化・呼吸数増加・低血圧などを評価するが、qSOFAが低くても敗血症を除外できない。",
    "related": [
      "sepsis",
      "hemodynamics",
      "coagulation"
    ]
  },
  {
    "id": "hus",
    "title": "HUS",
    "aliases": [
      "HUS",
      "溶血性尿毒症症候群"
    ],
    "what": "微小血管障害性の溶血性貧血、血小板減少、急性腎障害などを特徴とする症候群。",
    "normal": "赤血球は血管内を流れて酸素を運び、血小板と腎糸球体はそれぞれ止血・濾過を担う。",
    "why": "腸管出血性大腸菌感染後などで起こることがあり、志賀毒素による血管内皮障害などが関係する。",
    "related": [
      "ecoli",
      "kidney",
      "coagulation"
    ]
  },
  {
    "id": "de_escalation",
    "title": "de-escalation",
    "aliases": [
      "de-escalation",
      "狭域化",
      "抗菌薬適正使用",
      "AMS"
    ],
    "what": "初期に広く治療していた抗菌薬を、培養や臨床経過に基づき必要十分な範囲へ絞る考え方。",
    "normal": "病原体に有効な薬を適切な濃度で必要な期間投与することが感染治療の基本。",
    "why": "不要に広い薬は副作用・腸内細菌叢への影響・耐性選択などを増やしうる。患者の安定と菌情報を見て再評価する。",
    "related": [
      "pharm",
      "resistance",
      "antibiogram"
    ]
  },
  {
    "id": "streptolysin",
    "title": "溶血",
    "aliases": [
      "溶血",
      "α溶血",
      "β溶血",
      "γ溶血"
    ],
    "what": "血液寒天培地上で赤血球がどのように変化するかを分類した所見。αは緑色調、βは透明化、γは目立つ溶血なし。",
    "normal": "赤血球にはヘモグロビンが含まれ、溶血すると色や培地の見え方が変わる。",
    "why": "肺炎球菌はα溶血、A群レンサ球菌はβ溶血など同定の手がかりとなるが、単独で菌種は確定しない。",
    "related": [
      "pneumo",
      "staph",
      "test"
    ]
  },
  {
    "id": "post_antibiotic",
    "title": "PAE",
    "aliases": [
      "PAE",
      "post-antibiotic effect",
      "抗菌薬後効果"
    ],
    "what": "抗菌薬濃度がMIC未満へ下がった後も、一定期間細菌増殖が抑えられる現象。",
    "normal": "細菌は薬剤がなくなれば増殖を再開できるが、増殖装置の回復には時間がかかる場合がある。",
    "why": "アミノグリコシドなどでは投与間隔や濃度依存性殺菌作用の理解に重要。",
    "related": [
      "aminoglycoside",
      "auc",
      "mic"
    ]
  }
]);
