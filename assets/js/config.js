(function () {
  "use strict";

  const manufacturer = Object.freeze({
    name: "ООО «Метафарм»",
    address: "143080, Московская обл., г. о. Одинцовский, пгт. Лесной Городок, ул. Энергетиков, д. 3Б, Российская Федерация.",
    phone: "+7 901 500-51-15"
  });
  const orderedBy = Object.freeze({
    name: "ООО «Строгион»",
    address: "445144, Самарская область, Ставропольский р-н, с. Ягодное, Чудесная ул., д. 15, кв. 15г."
  });
  const common = {
    category: "Биологически активная добавка к пище",
    drugDisclaimer: "Биологически активная добавка к пище. Не является лекарственным средством.",
    capsules: "60",
    duration: "1 месяц",
    repeat: "При необходимости прием можно повторить.",
    contraindications: "Индивидуальная непереносимость компонентов, беременность, кормление грудью.",
    doctorNotice: "Перед применением рекомендуется проконсультироваться с врачом.",
    storage: "Хранить в сухом, защищенном от прямых солнечных лучей и недоступном для детей месте при температуре от 0 °C до +25 °C и относительной влажности воздуха не более 75%.",
    shelfLife: "2 года с даты изготовления.",
    manufacturer,
    orderedBy,
    brand: "ХилСорт / HEALSORT",
    sgrFileUrl: "",
    labelFileUrl: ""
  };

  window.PRODUCTS_DATA = Object.freeze({
    inositol: Object.freeze({
      ...common,
      slug: "inositol",
      name: "Инозитол оптимум",
      internationalName: "Inositol optimum",
      title: "Инозитол Оптимум",
      image: "../inozitol.jpg",
      officialName: "Биологически активная добавка к пище «Инозитол оптимум» («Inositol optimum»)",
      capsuleWeight: "660 мг",
      form: "Твердые желатиновые капсулы по 660 мг.",
      intendedUse: "Для реализации населению в качестве биологически активной добавки к пище — источника инозита.",
      composition: "Инозитол, магниевые соли стеариновой кислоты (агент антислеживающий), оболочка капсулы (желатин).",
      activeName: "Инозит",
      activeDaily: "1000 мг",
      dailyServing: "2 капсулы",
      dailyPercentage: "200% от адекватного уровня суточного потребления.",
      upperLimitNote: "Не превышает верхний допустимый уровень потребления.",
      usage: "Взрослым принимать по 2 капсулы в день во время еды.",
      sgr: "AM.01.07.01.003.R.000055.01.25",
      sgrDate: "30.01.2025",
      tu: "ТУ 10.89.19-014-53708851-2024",
      barcode: "4670226054109",
      nutrition: Object.freeze({
        per100g: Object.freeze([
          ["Белки", "15,6 г"],
          ["Жиры", "0,1 г"],
          ["Углеводы", "0,1 г"],
          ["Энергетическая ценность", "61 ккал / 254 кДж"]
        ]),
        note: "Показатели пищевой и энергетической ценности БАД определены расчетным путем."
      }),
      shopUrl: "https://healsort.ru/catalog/inositol"
    }),
    magnesium: Object.freeze({
      ...common,
      slug: "magnesium",
      name: "Магния хелат оптимум",
      internationalName: "Magnesium chelate optimum",
      title: "Магния Хелат Оптимум",
      image: "../magniy.jpg",
      officialName: "Биологически активная добавка к пище «Магния хелат оптимум» («Magnesium chelate optimum»)",
      capsuleWeight: "620 мг",
      form: "Твердые капсулы по 620 мг.",
      intendedUse: "Для реализации населению в качестве биологически активной добавки к пище — дополнительного источника магния.",
      composition: "Магния хелат (бисглицинат), капсула (желатин), микрокристаллическая целлюлоза (носитель).",
      activeName: "Магний",
      activeOneCapsule: "120 мг",
      percentageOne: "30% от рекомендуемого уровня суточного потребления.",
      activeThreeCapsules: "360 мг",
      percentageThree: "90% от рекомендуемого уровня суточного потребления.",
      dailyServing: "1–3 капсулы",
      usage: "Взрослым принимать по 1–3 капсулы в день во время еды.",
      sgr: "AM.01.07.01.003.R.000947.11.25",
      sgrDate: "25.11.2025",
      tu: "ТУ 10.89.19-074-53708851-2025",
      barcode: "4670226054116",
      rusPLabel: "РУСП — рекомендуемый уровень суточного потребления.",
      nutrition: Object.freeze({
        per100g: Object.freeze([
          ["Белки", "15,5 г"],
          ["Жиры", "0,1 г"],
          ["Углеводы", "0,1 г"],
          ["Энергетическая ценность", "65,0 ккал / 270,0 кДж"]
        ]),
        perServing: Object.freeze([
          ["Белки", "0,1 г"],
          ["Жиры", "0,0 г"],
          ["Углеводы", "0,0 г"],
          ["Энергетическая ценность", "0,4 ккал / 1,5 кДж"]
        ]),
        servingWeight: "0,74 г",
        note: "Показатели пищевой и энергетической ценности БАД определены расчетным путем."
      }),
      shopUrl: "https://healsort.ru/catalog/magnesium"
    })
  });

  window.SITE_CONFIG = Object.freeze({
    MAIN_SITE_URL: "https://guturutyy-ops.github.io/heal/",
    BUSINESS_CARD_URL: "https://guturutyy-ops.github.io/sort/",
    TELEGRAM_BOT_URL: "https://t.me/healsort_bot",
    MAX_BOT_URL: "",
    REACTION_ENDPOINT: "",
    REACTION_PRIVACY_URL: ""
  });
})();
