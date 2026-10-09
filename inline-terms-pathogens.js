/* Missing named pathogens explained at first mention; normal host protection contrasted with pathology. */
window.INFECT_TERM_ENTRIES=(window.INFECT_TERM_ENTRIES||[]).concat([
  {
    "id": "vanco",
    "title": "バンコマイシン",
    "aliases": [
      "バンコマイシン"
    ],
    "what": "細菌の細胞壁を作る材料の末端に結合し、その材料を利用できなくするグリコペプチド系抗菌薬。",
    "normal": "菌はペプチドグリカン前駆体のD-Ala-D-Ala末端を利用して細胞壁を組み立てる。",
    "why": "通常の黄色ブドウ球菌などに活性があるが、VREでは末端が変わることで結合力が低下する。腎障害などに注意。",
    "related": [
      "pg",
      "vr_enterococci",
      "dala"
    ]
  },
  {
    "id": "vr_enterococci",
    "title": "VRE",
    "aliases": [
      "VRE",
      "バンコマイシン耐性腸球菌"
    ],
    "what": "腸球菌（Enterococcus）のうちバンコマイシンに耐性を持つ菌。通常腸管などに生息するが、病院感染の原因にもなる。",
    "normal": "腸球菌は腸内細菌叢の一部として存在する場合がある。細胞壁の材料を合成し増殖する。",
    "why": "耐性遺伝子によりD-Ala-D-Ala末端をD-Ala-D-Lac等に変えると、バンコマイシンの結合が弱くなる。",
    "related": [
      "vanco",
      "dala",
      "resistance"
    ]
  },
  {
    "id": "dala",
    "title": "D-Ala-D-Ala",
    "aliases": [
      "D-Ala-D-Ala",
      "D-Ala-D-Lac"
    ],
    "what": "細菌の細胞壁前駆体を構成するペプチド末端。Dはアミノ酸の立体配置、Alaはアラニン、Lacは乳酸由来構造を示す。",
    "normal": "D-Ala-D-Ala末端を持つ材料を酵素が利用してペプチドグリカンの架橋を進める。",
    "why": "耐性腸球菌では末端を変えてバンコマイシンが結合しにくくなる。PBPを直接阻害するβラクタム系とは作用点が違う。",
    "related": [
      "pg",
      "vanco",
      "vr_enterococci"
    ]
  },
  {
    "id": "staph",
    "title": "黄色ブドウ球菌",
    "aliases": [
      "黄色ブドウ球菌",
      "Staphylococcus aureus"
    ],
    "what": "皮膚や鼻腔に定着することもあるGram陽性球菌。カタラーゼ陽性・コアグラーゼ陽性などが同定の手がかり。",
    "normal": "正常皮膚と粘膜のバリアがあれば菌が存在しても直ちに感染症ではない。",
    "why": "皮膚膿瘍、菌血症、感染性心内膜炎、骨髄炎などを起こす。MRSAかMSSAかで抗菌薬の選択が変わる。",
    "related": [
      "gram_pos",
      "mrsa",
      "endocardium"
    ]
  },
  {
    "id": "coagulase",
    "title": "コアグラーゼ",
    "aliases": [
      "コアグラーゼ",
      "カタラーゼ"
    ],
    "what": "コアグラーゼは血漿の凝固に関係する反応を起こす酵素。カタラーゼは過酸化水素を水と酸素へ分解する酵素。",
    "normal": "細菌も代謝中に酸化ストレスを受け、その処理にカタラーゼなどを利用する。",
    "why": "ブドウ球菌は一般にカタラーゼ陽性、黄色ブドウ球菌はコアグラーゼ陽性。レンサ球菌との鑑別に役立つ。",
    "related": [
      "staph",
      "innate"
    ]
  },
  {
    "id": "pneumo",
    "title": "肺炎球菌",
    "aliases": [
      "肺炎球菌",
      "Streptococcus pneumoniae"
    ],
    "what": "肺炎、髄膜炎、中耳炎などの主要原因菌となるGram陽性の双球菌。多糖被膜が重要な病原因子。",
    "normal": "上気道の細菌は粘膜防御や抗体・補体により、通常は深部への侵入が制限される。",
    "why": "肺胞へ侵入すると肺炎、血液・髄液へ侵入すると侵襲性感染を起こす。脾機能低下・抗体機能障害では特に危険。",
    "related": [
      "encap",
      "airway",
      "csf"
    ]
  },
  {
    "id": "ecoli",
    "title": "大腸菌",
    "aliases": [
      "大腸菌",
      "Escherichia coli"
    ],
    "what": "腸内細菌叢に含まれうるGram陰性桿菌。菌株によって尿路感染、菌血症、腸管感染などを起こす。",
    "normal": "正常の腸管内では多数の微生物が共存し、腸管上皮と免疫が侵入を抑える。",
    "why": "尿道を上行すると膀胱炎・腎盂腎炎を生じる。病原性大腸菌の一部は毒素による下痢・HUSを起こす。",
    "related": [
      "gram_neg",
      "kidney",
      "lps"
    ]
  },
  {
    "id": "pseudomonas",
    "title": "緑膿菌",
    "aliases": [
      "緑膿菌",
      "Pseudomonas aeruginosa"
    ],
    "what": "湿潤環境にも存在するGram陰性桿菌。外膜透過性の低さ、排出ポンプ、分解酵素などによる耐性が重要。",
    "normal": "健康な皮膚や上皮バリア・好中球は、外来細菌の侵入を防いでいる。",
    "why": "人工呼吸器関連肺炎、熱傷感染、血流感染などで問題となり、一般的なセフトリアキソンでは通常カバーできない。",
    "related": [
      "outer_membrane",
      "resistance",
      "innate"
    ]
  },
  {
    "id": "clostridioides",
    "title": "C. difficile",
    "aliases": [
      "C. difficile",
      "Clostridioides difficile",
      "偽膜性腸炎"
    ],
    "what": "芽胞を形成する嫌気性の細菌。毒素によって抗菌薬関連の大腸炎や水様性下痢を起こすことがある。",
    "normal": "腸内細菌叢が競合することで外来菌の増殖を抑えており、大腸は水や電解質を吸収する。",
    "why": "抗菌薬で菌叢が変化すると増殖しやすくなり、毒素が腸粘膜を傷害する。核酸陽性だけで発症を断定しない。",
    "related": [
      "anaerobe",
      "toxin",
      "test"
    ]
  },
  {
    "id": "legionella",
    "title": "レジオネラ",
    "aliases": [
      "レジオネラ",
      "Legionella pneumophila"
    ],
    "what": "水環境で増殖し、微細な水滴の吸入などで肺炎を起こしうる細菌。マクロファージ内で生存・増殖できる。",
    "normal": "肺胞マクロファージは吸入された病原体を貪食し、通常は細胞内で殺菌する。",
    "why": "細胞内に薬剤が移行する必要があり、一部のマクロライド・キノロン等が治療選択肢となる。",
    "related": [
      "alveolar_macrophage",
      "airway",
      "macrolide"
    ]
  },
  {
    "id": "mycoplasma",
    "title": "マイコプラズマ",
    "aliases": [
      "マイコプラズマ",
      "Mycoplasma pneumoniae"
    ],
    "what": "細菌なのにペプチドグリカン細胞壁を持たない病原体。主に呼吸器感染を起こす。",
    "normal": "多くの細菌では細胞壁が形状・機械的強度を保つが、この菌は膜の性質などで生存する。",
    "why": "PBPや細菌壁を狙うβラクタムは原理的に作用しない。適応に応じタンパク質合成阻害薬などを考える。",
    "related": [
      "wall",
      "beta_lactam",
      "airway"
    ]
  },
  {
    "id": "chlamydia",
    "title": "クラミジア",
    "aliases": [
      "クラミジア",
      "Chlamydia trachomatis"
    ],
    "what": "宿主細胞内で増殖する偏性細胞内寄生性の細菌。尿道炎・子宮頸管炎・骨盤内炎症性疾患などを起こす。",
    "normal": "粘膜上皮と局所免疫は性行為などによる微生物侵入を抑える役割を持つ。",
    "why": "無症状感染もあり、放置すると不妊に関わる炎症が起こりうる。細胞内へ届く薬とパートナー対応が重要。",
    "related": [
      "cell",
      "innate",
      "test"
    ]
  },
  {
    "id": "meningococcus",
    "title": "髄膜炎菌",
    "aliases": [
      "髄膜炎菌",
      "Neisseria meningitidis"
    ],
    "what": "Gram陰性双球菌で、鼻咽頭に保菌されることがあり、菌血症・髄膜炎などを起こす。",
    "normal": "補体の終末成分などが細菌の血中生存を抑制する。被膜も病原因子の一つ。",
    "why": "髄膜炎や急速な敗血症性ショックを起こすことがあり、終末補体欠損では特に感染リスクが高まる。",
    "related": [
      "complement",
      "encap",
      "csf"
    ]
  },
  {
    "id": "gonococcus",
    "title": "淋菌",
    "aliases": [
      "淋菌",
      "Neisseria gonorrhoeae"
    ],
    "what": "Gram陰性双球菌で、尿道炎・子宮頸管炎・骨盤内炎症性疾患などを起こす性感染症の原因菌。",
    "normal": "粘膜上皮と分泌物などが外界の病原体の侵入を抑える。",
    "why": "抗菌薬耐性が問題になり、適切な検体による核酸検査・感受性情報、パートナー対応が重要。",
    "related": [
      "gram_neg",
      "test",
      "meningococcus"
    ]
  },
  {
    "id": "listeria",
    "title": "リステリア",
    "aliases": [
      "リステリア",
      "Listeria monocytogenes"
    ],
    "what": "食品を介して感染することがあるGram陽性桿菌。妊婦、新生児、高齢者、細胞性免疫低下者で重要。",
    "normal": "食物による微生物曝露の多くは胃酸・腸管バリアや細胞性免疫によって制御される。",
    "why": "菌血症・髄膜炎・母子感染を起こしうる。セフトリアキソン等のセフェム単独では通常十分にカバーされない。",
    "related": [
      "pediatric",
      "csf",
      "tcell"
    ]
  },
  {
    "id": "tuberculosis",
    "title": "結核菌",
    "aliases": [
      "結核菌",
      "Mycobacterium tuberculosis"
    ],
    "what": "ミコール酸に富む特殊な細胞壁を持ち、主に空気感染する抗酸菌。肺胞マクロファージ内で生存しうる。",
    "normal": "細胞性免疫はマクロファージを活性化し、肉芽腫形成などで感染を封じ込める。",
    "why": "潜在性と活動性を区別し、活動性では菌検査・画像を踏まえ多剤治療が必要になる。",
    "related": [
      "acidfast",
      "mycolic",
      "granuloma"
    ]
  },
  {
    "id": "candida",
    "title": "Candida",
    "aliases": [
      "Candida",
      "カンジダ"
    ],
    "what": "皮膚・口腔・消化管・腟などに定着することもある酵母様真菌。菌種によって抗真菌薬感受性が異なる。",
    "normal": "正常の粘膜・細菌叢・好中球は真菌が組織へ深く侵入するのを抑えている。",
    "why": "菌血症や侵襲性カンジダ症は重要だが、喀痰や口腔からの検出は定着のこともある。",
    "related": [
      "fungus",
      "innate",
      "glycol"
    ]
  },
  {
    "id": "aspergillus",
    "title": "Aspergillus",
    "aliases": [
      "Aspergillus",
      "アスペルギルス"
    ],
    "what": "空気中に分生子が存在する糸状菌。吸入後、好中球減少などで侵襲性肺アスペルギルス症を起こす。",
    "normal": "吸入された真菌の分生子を肺の免疫細胞が処理し、菌糸の組織侵入を防ぐ。",
    "why": "侵襲性病変では肺の血管・組織へ菌糸が侵入することがあり、画像や抗原検査・病理を用いて評価する。",
    "related": [
      "fungus",
      "innate",
      "airway"
    ]
  },
  {
    "id": "cryptococcus",
    "title": "Cryptococcus",
    "aliases": [
      "Cryptococcus",
      "クリプトコックス"
    ],
    "what": "多糖被膜を持つ酵母で、細胞性免疫が弱い患者では髄膜炎などを起こすことがある。",
    "normal": "CD4陽性T細胞等による細胞性免疫が感染制御に役立つ。",
    "why": "髄液・血清のクリプトコックス抗原検査が重要。髄膜炎では頭蓋内圧亢進などにも注意する。",
    "related": [
      "fungus",
      "encap",
      "csf"
    ]
  },
  {
    "id": "mucor",
    "title": "ムーコル",
    "aliases": [
      "ムーコル",
      "ムーコル症"
    ],
    "what": "Mucorales目の真菌による侵襲性感染症で、糖尿病性ケトアシドーシスや強い免疫抑制などが危険因子。",
    "normal": "好中球等の自然免疫は吸入・付着した環境真菌の組織侵入を抑える。",
    "why": "血管侵襲・壊死を起こしやすく、治療に外科的切除が必要になることがある。ボリコナゾール単独は通常有効でない。",
    "related": [
      "fungus",
      "innate",
      "source"
    ]
  },
  {
    "id": "hsv",
    "title": "HSV",
    "aliases": [
      "HSV",
      "HSV-1",
      "HSV-2",
      "単純ヘルペス"
    ],
    "what": "単純ヘルペスウイルス。皮膚粘膜病変や脳炎を起こし、神経節に潜伏することがあるDNAウイルス。",
    "normal": "細胞内のウイルス増殖は宿主免疫によって通常抑制されている。",
    "why": "再活性化で病変が繰り返し生じる。HSV脳炎では速やかな抗ウイルス薬治療が重要。",
    "related": [
      "viral_latency",
      "dna_poly",
      "tk"
    ]
  },
  {
    "id": "vzv",
    "title": "VZV",
    "aliases": [
      "VZV",
      "水痘帯状疱疹ウイルス",
      "帯状疱疹"
    ],
    "what": "水痘と帯状疱疹を起こすDNAウイルス。初感染後に感覚神経節へ潜伏することがある。",
    "normal": "T細胞などが潜伏ウイルスの再増殖を抑える。",
    "why": "再活性化すると神経分布に沿う痛みと片側性の水疱性発疹を起こしうる。",
    "related": [
      "viral_latency",
      "hsv",
      "virus"
    ]
  },
  {
    "id": "cmv",
    "title": "CMV",
    "aliases": [
      "CMV",
      "サイトメガロウイルス"
    ],
    "what": "ヘルペスウイルス科のDNAウイルス。感染後も持続・潜伏し、免疫不全者で臓器疾患を起こしうる。",
    "normal": "細胞性免疫がウイルス増殖を抑えるため、感染していても無症状のことがある。",
    "why": "移植後などで網膜炎・大腸炎・肺炎を起こしうる。ガンシクロビル系は骨髄抑制に注意。",
    "related": [
      "virus",
      "tcell",
      "tk"
    ]
  },
  {
    "id": "ebv",
    "title": "EBV",
    "aliases": [
      "EBV",
      "Epstein-Barr"
    ],
    "what": "B細胞に感染して潜伏することがあるヘルペスウイルス。伝染性単核球症などで重要。",
    "normal": "細胞性免疫がEBV感染細胞の増殖を監視し制御する。",
    "why": "発熱、咽頭痛、リンパ節腫脹を起こし、免疫抑制下のリンパ増殖性疾患にも関係する。",
    "related": [
      "virus",
      "tcell",
      "antibody"
    ]
  },
  {
    "id": "rsv",
    "title": "RSV",
    "aliases": [
      "RSV",
      "RSウイルス"
    ],
    "what": "呼吸器合胞体ウイルス。乳児や高齢者などで下気道感染を起こしうるRNAウイルス。",
    "normal": "正常の細気管支は空気を通し、線毛・粘液や局所免疫が病原体を排除する。",
    "why": "細気管支の浮腫・分泌物で気道が狭まり、喘鳴や陥没呼吸・低酸素を起こすことがある。",
    "related": [
      "airway",
      "gas",
      "virus"
    ]
  },
  {
    "id": "hiv",
    "title": "HIV",
    "aliases": [
      "HIV",
      "ヒト免疫不全ウイルス"
    ],
    "what": "RNAゲノムを逆転写してDNAを作り、宿主ゲノムに組み込むレトロウイルス。主にCD4 T細胞などに感染する。",
    "normal": "CD4陽性T細胞は他の免疫細胞を調節し、細胞内病原体への防御に重要。",
    "why": "治療しないと免疫機能が徐々に低下し、日和見感染のリスクが増える。複数薬剤でウイルス増殖を抑える。",
    "related": [
      "rt",
      "integrase",
      "tcell"
    ]
  },
  {
    "id": "hbv",
    "title": "HBV",
    "aliases": [
      "HBV",
      "B型肝炎ウイルス"
    ],
    "what": "DNAウイルスだが、複製過程で逆転写を使う特徴を持つ肝炎ウイルス。",
    "normal": "正常な肝細胞は代謝・解毒・タンパク質合成を担い、免疫が感染細胞を制御する。",
    "why": "慢性肝炎から肝硬変・肝癌につながりうる。核内cccDNAが残り、治療で複製を抑えても通常完全除去は難しい。",
    "related": [
      "rt",
      "cccDNA",
      "hepatitis_serology"
    ]
  },
  {
    "id": "hcv",
    "title": "HCV",
    "aliases": [
      "HCV",
      "C型肝炎ウイルス"
    ],
    "what": "RNAウイルスで、NS3/4Aプロテアーゼ・NS5A・NS5Bポリメラーゼなどが複製に関わる。",
    "normal": "宿主は感染細胞を免疫で制御し、肝臓の正常な構造と機能を維持する。",
    "why": "慢性感染で肝線維化・肝硬変・肝癌のリスクが上昇する。DAAでウイルス排除を目指す。",
    "related": [
      "daa",
      "dna_poly",
      "hepatitis_serology"
    ]
  },
  {
    "id": "toxoplasma",
    "title": "Toxoplasma",
    "aliases": [
      "Toxoplasma",
      "トキソプラズマ",
      "Toxoplasma gondii"
    ],
    "what": "細胞内寄生性原虫で、加熱不十分な肉などから感染しうる。妊婦・免疫不全者で重要。",
    "normal": "T細胞などの細胞性免疫が原虫の増殖を制御する。",
    "why": "免疫低下で脳炎、妊娠中の初感染で先天性トキソプラズマ症の原因となりうる。",
    "related": [
      "parasite",
      "tcell",
      "pediatric"
    ]
  },
  {
    "id": "giardia",
    "title": "Giardia",
    "aliases": [
      "Giardia",
      "ジアルジア",
      "ランブル鞭毛虫"
    ],
    "what": "小腸に寄生する原虫。嚢子を含む飲料水・食品などから感染することがある。",
    "normal": "正常の小腸は絨毛と消化酵素を使って脂質などの栄養を吸収する。",
    "why": "絨毛機能が障害され、脂肪便・腹満・体重減少などの吸収不良を起こしうる。",
    "related": [
      "parasite",
      "protozoan_stages"
    ]
  },
  {
    "id": "amoeba",
    "title": "Entamoeba",
    "aliases": [
      "Entamoeba",
      "赤痢アメーバ",
      "Entamoeba histolytica"
    ],
    "what": "大腸粘膜へ侵入しアメーバ赤痢を起こす原虫。肝膿瘍の原因にもなる。",
    "normal": "正常の大腸粘膜は水分吸収と腸内微生物からの防御を担う。",
    "why": "腸粘膜の潰瘍で血便・腹痛が生じ、肝へ広がれば膿瘍を形成する。治療では腸管内腔の原虫対策も重要。",
    "related": [
      "parasite",
      "protozoan_stages",
      "metronidazole"
    ]
  }
]);
