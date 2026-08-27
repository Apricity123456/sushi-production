"use client";

import { useEffect, useMemo, useState } from "react";

/* =========================================================
   TYPES
========================================================= */

type MenuItem = {
  product: string;
  pieces: number;
};

type Menu = {
  id: string;
  name: string;
  items: MenuItem[];
};

type SelectedMenu = {
  menuId: string;
  quantity: number;
};

type DayData = {
  menus: SelectedMenu[];
  directRolls: Record<string, number>;
  finalList: Record<string, number>;
};

type ProductionLine = {
  product: string;
  pieces: number;
  rolls: number;
};

const STORAGE_KEY = "sushi-production-v5";

const PIECES_PER_ROLL = 8;

/* =========================================================
   ALL MENUS
   IMPORTANT:
   The numbers below are PIECES, not rolls.
========================================================= */

const MENUS: Menu[] = [
  {
    id: "110008",
    name: "SAKURA",
    items: [
      { product: "sushis saumon", pieces: 2 },
      { product: "makis tempura", pieces: 5 },
      { product: "croquants saumon avocat", pieces: 4 },
      { product: "cali saumon sweet crispy", pieces: 4 },
    ],
  },

  {
    id: "110011",
    name: "POUR LES ENFANTS",
    items: [
      { product: "sushis saumon", pieces: 2 },
      { product: "cali saumon cheese", pieces: 2 },
      { product: "icerolls saumon cheese", pieces: 2 },
    ],
  },

  {
    id: "110012",
    name: "L’EXPLOSION",
    items: [
      { product: "sushis saumon spicy", pieces: 4 },
      { product: "cali saumon avocat spicy", pieces: 8 },
      {
        product: "croquants surimi avocat concombre spicy",
        pieces: 4,
      },
      {
        product: "cali surimi avocat concombre spicy",
        pieces: 4,
      },
    ],
  },

  {
    id: "110013",
    name: "L’INCONTOURNABLE",
    items: [
      { product: "sushis saumon", pieces: 6 },
      { product: "cali saumon avocat", pieces: 8 },
    ],
  },

  {
    id: "110014",
    name: "L’IRRESISTIBLE",
    items: [
      { product: "sushis thon", pieces: 2 },
      {
        product: "gunkans tartare saumon avocat wasabi",
        pieces: 2,
      },
      { product: "sushis saumon", pieces: 2 },
      { product: "springrolls saumon avocat", pieces: 4 },
      { product: "cali saumon avocat", pieces: 8 },
      { product: "sashimis saumon", pieces: 5 },
    ],
  },

  {
    id: "110015",
    name: "LE DIVIN",
    items: [
      { product: "cali saumon cheese", pieces: 8 },
      { product: "cali saumon avocat", pieces: 8 },
      { product: "makis saumon", pieces: 8 },
    ],
  },

  {
    id: "110016",
    name: "LE PACIFIC",
    items: [
      { product: "sushis saumon", pieces: 4 },
      { product: "sushis thon", pieces: 4 },
      { product: "cali saumon avocat", pieces: 4 },
      { product: "cali surimi avocat concombre", pieces: 4 },
    ],
  },

  {
    id: "110017",
    name: "LA ZEN",
    items: [
      { product: "makis saumon", pieces: 4 },
      { product: "sushis thon", pieces: 2 },
      { product: "sushis saumon", pieces: 3 },
      { product: "sushis crevette", pieces: 1 },
    ],
  },

  {
    id: "110018",
    name: "SUSHIMAN",
    items: [
      { product: "sushis saumon", pieces: 4 },
      { product: "sushis thon", pieces: 2 },
      { product: "sushis crevette", pieces: 2 },
      { product: "makis saumon", pieces: 8 },
      { product: "makis thon", pieces: 8 },
    ],
  },

  {
    id: "110019",
    name: "TENTATION SAUMON CHEESE",
    items: [
      { product: "sushis saumon + cheese", pieces: 4 },
      { product: "cali saumon cheese", pieces: 8 },
      { product: "icerolls saumon cheese", pieces: 8 },
    ],
  },

  {
    id: "110020",
    name: "THE BEST",
    items: [
      { product: "springrolls saumon avocat", pieces: 8 },
      { product: "cali saumon avocat", pieces: 8 },
      { product: "makis saumon", pieces: 8 },
    ],
  },

  {
    id: "110021",
    name: "BOX DÉCOUVERTE",
    items: [
      {
        product: "croquants surimi avocat concombre",
        pieces: 4,
      },
      { product: "sushis saumon", pieces: 3 },
      { product: "cali thon cuit avocat", pieces: 4 },
    ],
  },

  {
    id: "110022",
    name: "BOX ÉTUDIANT",
    items: [
      {
        product: "croquants surimi avocat concombre",
        pieces: 4,
      },
      { product: "makis saumon", pieces: 4 },
      { product: "cali saumon avocat", pieces: 4 },
    ],
  },

  {
    id: "110023",
    name: "CALIFORNIA MIX",
    items: [
      { product: "cali saumon avocat", pieces: 4 },
      { product: "cali saumon cheese", pieces: 4 },
      { product: "cali thon cuit avocat", pieces: 4 },
    ],
  },

  {
    id: "110027",
    name: "PLATEAU SAMOURAI",
    items: [
      { product: "sushis saumon", pieces: 4 },
      { product: "sushis thon", pieces: 2 },
      { product: "sushis crevette", pieces: 2 },
      {
        product: "gunkans tartare saumon avocat wasabi",
        pieces: 2,
      },
      { product: "cali saumon cheese", pieces: 8 },
      { product: "cali saumon avocat", pieces: 8 },
      { product: "makis concombre", pieces: 8 },
      {
        product: "cali thon cuit mayonnaise avocat",
        pieces: 8,
      },
    ],
  },

  {
    id: "110028",
    name: "VEGGIE BOX",
    items: [
      { product: "croquants veggie spicy", pieces: 8 },
      { product: "cali avocat cheese", pieces: 8 },
    ],
  },

  {
    id: "110029",
    name: "CLASSIC MAKI",
    items: [
      { product: "makis saumon", pieces: 8 },
      { product: "makis thon tataki", pieces: 8 },
      { product: "makis avocat", pieces: 8 },
    ],
  },

  {
    id: "110032",
    name: "BOX SIGNATURE",
    items: [
      {
        product: "springrolls cheese saumon avocat",
        pieces: 4,
      },
      {
        product: "croquants surimi avocat concombre",
        pieces: 4,
      },
      { product: "cali saumon avocat", pieces: 4 },
      { product: "dragon rolls tempura", pieces: 4 },
      { product: "cali saumon sweet crispy", pieces: 4 },
      { product: "sushis saumon", pieces: 2 },
    ],
  },

  {
    id: "110033",
    name: "CLASSIC CALIFORNIA",
    items: [
      { product: "cali saumon avocat", pieces: 8 },
      { product: "cali saumon cheese", pieces: 8 },
      {
        product: "cali thon cuit mayonnaise avocat",
        pieces: 8,
      },
    ],
  },

  {
    id: "110038",
    name: "CHEESE LOVER",
    items: [
      { product: "croquants saumon cheese", pieces: 4 },
      { product: "icerolls saumon cheese", pieces: 4 },
      { product: "cali saumon cheese", pieces: 4 },
    ],
  },

  {
    id: "110039",
    name: "ASAKUSA",
    items: [
      {
        product: "cali surimi cheese avocat concombre",
        pieces: 4,
      },
      {
        product: "croquants surimi avocat concombre",
        pieces: 4,
      },
      {
        product: "cali thon cuit mayonnaise avocat",
        pieces: 4,
      },
      {
        product: "croquants thon cuit mayonnaise avocat",
        pieces: 4,
      },
    ],
  },

  {
    id: "110042",
    name: "L’AMATEUR",
    items: [
      { product: "makis cheese", pieces: 4 },
      { product: "makis avocat", pieces: 4 },
      { product: "makis saumon", pieces: 8 },
      { product: "sushis saumon", pieces: 4 },
      { product: "sushis saumon + cheese", pieces: 2 },
      { product: "cali saumon cheese", pieces: 8 },
      { product: "springrolls saumon avocat", pieces: 8 },
      {
        product: "croquants surimi avocat concombre",
        pieces: 8,
      },
    ],
  },

  {
    id: "110043",
    name: "BOX DU MOIS",
    items: [],
  },

  {
    id: "110047",
    name: "L’INCONTOURNABLE VERDE",
    items: [
      { product: "sushis saumon", pieces: 6 },
      { product: "springrolls saumon avocat", pieces: 8 },
    ],
  },

  {
    id: "110048",
    name: "MIDORI BOX",
    items: [
      { product: "sushis saumon", pieces: 4 },
      {
        product: "springrolls saumon cheese avocat",
        pieces: 8,
      },
      { product: "icerolls saumon cheese", pieces: 8 },
    ],
  },

  {
    id: "110049",
    name: "SPLENDIDE",
    items: [
      {
        product: "croquants surimi avocat concombre",
        pieces: 8,
      },
      { product: "cali thon cuit avocat", pieces: 8 },
      { product: "springrolls saumon avocat", pieces: 8 },
    ],
  },

  {
    id: "110050",
    name: "LA DÉBUTANTE",
    items: [
      { product: "sushis saumon", pieces: 2 },
      { product: "makis saumon", pieces: 4 },
      { product: "makis avocat", pieces: 4 },
      { product: "springrolls saumon avocat", pieces: 4 },
      {
        product: "croquants surimi avocat concombre",
        pieces: 4,
      },
      { product: "cali thon cuit avocat", pieces: 4 },
    ],
  },

  {
    id: "110051",
    name: "CREATIVE",
    items: [
      { product: "blackrolls saumon cheese", pieces: 4 },
      { product: "cali veggie", pieces: 4 },
      { product: "croquants veggie", pieces: 4 },
      { product: "icerolls saumon cheese", pieces: 4 },
      { product: "dragon rolls tempura", pieces: 4 },
      { product: "sushis saumon", pieces: 2 },
    ],
  },

  {
    id: "110057",
    name: "BOX SPICY",
    items: [
      { product: "cali saumon avocat", pieces: 4 },
      { product: "sushis saumon", pieces: 3 },
      { product: "makis concombre", pieces: 4 },
      {
        product: "croquants surimi avocat concombre",
        pieces: 4,
      },
    ],
  },

  {
    id: "110058",
    name: "BOX SWEET WASABI",
    items: [
      { product: "sushis saumon", pieces: 3 },
      { product: "makis avocat", pieces: 4 },
      { product: "springrolls saumon avocat", pieces: 4 },
      { product: "croquants tempura", pieces: 4 },
    ],
  },

  {
    id: "110074",
    name: "MAKIDO",
    items: [
      { product: "makis saumon", pieces: 8 },
      { product: "makis thon cuit", pieces: 8 },
      { product: "makis cheese", pieces: 8 },
      { product: "makis concombre", pieces: 8 },
      { product: "cali saumon avocat", pieces: 8 },
      { product: "croquants thon cuit avocat", pieces: 8 },
      { product: "springrolls saumon avocat", pieces: 8 },
    ],
  },

  {
    id: "110075",
    name: "LE SENSEI",
    items: [
      { product: "sushis saumon", pieces: 4 },
      {
        product: "sushis saumon cheese sésame",
        pieces: 4,
      },
      { product: "sushis saumon mi-cuit", pieces: 4 },
      { product: "dragon rolls tempura", pieces: 8 },
      {
        product: "cali avocat cheese furikake",
        pieces: 8,
      },
      {
        product: "springrolls thon cuit avocat",
        pieces: 8,
      },
      { product: "makis saumon", pieces: 4 },
      { product: "makis avocat", pieces: 4 },
    ],
  },

  {
    id: "110076",
    name: "L’INCONTOURNABLE CROQUANT",
    items: [
      { product: "sushis saumon", pieces: 6 },
      { product: "croquants saumon avocat", pieces: 8 },
    ],
  },

  {
    id: "110077",
    name: "L’ESSENTIELLE",
    items: [
      { product: "sushis saumon", pieces: 3 },
      { product: "makis saumon", pieces: 4 },
      { product: "cali saumon avocat", pieces: 8 },
    ],
  },

  {
    id: "110078",
    name: "MAKI LOVER",
    items: [
      { product: "makis saumon", pieces: 4 },
      { product: "makis avocat", pieces: 4 },
      { product: "makis cheese", pieces: 4 },
      { product: "makis concombre", pieces: 4 },
      {
        product: "makis thon cuit mayonnaise",
        pieces: 4,
      },
    ],
  },

  {
    id: "110079",
    name: "SHIRO BOX SANS ALGUE",
    items: [
      { product: "springrolls saumon avocat", pieces: 8 },
      {
        product: "springrolls thon cuit avocat",
        pieces: 8,
      },
      { product: "snowrolls saumon cheese", pieces: 8 },
    ],
  },

  {
    id: "110080",
    name: "TUNA LOVER",
    items: [
      {
        product: "croquants thon cuit mayonnaise avocat",
        pieces: 8,
      },
      {
        product: "cali thon cuit mayonnaise avocat",
        pieces: 8,
      },
      {
        product: "springrolls thon cuit mayonnaise avocat",
        pieces: 8,
      },
    ],
  },

  {
    id: "110081",
    name: "KAIZEN SAUMON",
    items: [
      { product: "rolls signature saumon", pieces: 4 },
      { product: "springrolls saumon avocat", pieces: 8 },
      { product: "cali avocat cheese", pieces: 4 },
    ],
  },

  {
    id: "110082",
    name: "KAIZEN THON",
    items: [
      { product: "cali tartare thon truffe", pieces: 4 },
      {
        product: "croquants thon cuit mayonnaise avocat",
        pieces: 4,
      },
      {
        product: "springrolls thon cuit mayonnaise avocat",
        pieces: 8,
      },
    ],
  },

  {
    id: "110083",
    name: "CHEESY CHEDDAR",
    items: [
      {
        product: "cali cheddar thon cuit mayonnaise avocat",
        pieces: 4,
      },
      { product: "cali cheddar veggie", pieces: 4 },
      { product: "springrolls saumon avocat", pieces: 4 },
      {
        product: "croquants thon cuit mayonnaise avocat",
        pieces: 4,
      },
    ],
  },

  {
    id: "110084",
    name: "CHEESY PROVOLA",
    items: [
      {
        product: "cali provola fumée thon cuit mayonnaise avocat",
        pieces: 4,
      },
      {
        product: "cali provola fumée veggie",
        pieces: 4,
      },
      {
        product: "springrolls thon cuit mayonnaise avocat",
        pieces: 4,
      },
      { product: "cali saumon avocat", pieces: 4 },
    ],
  },

  {
    id: "110085",
    name: "AMATEUR VERDE",
    items: [
      { product: "sushis saumon", pieces: 4 },
      { product: "sushis crevette", pieces: 2 },
      {
        product: "springrolls crunchy thon cuit mayonnaise avocat",
        pieces: 8,
      },
      { product: "springrolls saumon avocat", pieces: 8 },
      { product: "springrolls avocat cheese", pieces: 8 },
      { product: "snowrolls avocat cheese", pieces: 8 },
      { product: "icerolls saumon cheese", pieces: 8 },
    ],
  },

  {
    id: "110087",
    name: "INCONTOURNABLE CHEESE",
    items: [
      { product: "sushis saumon", pieces: 6 },
      { product: "californias saumon cheese", pieces: 8 },
    ],
  },

  {
    id: "110088",
    name: "NORUU BOX",
    items: [
      { product: "makis saumon", pieces: 8 },
      { product: "croquants saumon avocat", pieces: 8 },
      { product: "cali saumon cheese", pieces: 8 },
    ],
  },

  {
    id: "110089",
    name: "SALMON LOVER",
    items: [
      { product: "springrolls saumon avocat", pieces: 8 },
      { product: "cali saumon avocat", pieces: 8 },
      { product: "croquants saumon avocat", pieces: 8 },
    ],
  },

  {
    id: "110090",
    name: "MIX & MATCH",
    items: [
      { product: "sushis saumon", pieces: 2 },
      { product: "cali saumon avocat", pieces: 4 },
      { product: "makis saumon", pieces: 4 },
      { product: "cali saumon cheese", pieces: 4 },
    ],
  },

  {
    id: "110091",
    name: "CROUSTY CHICKEN BOX",
    items: [
      { product: "cali poulet katsu", pieces: 4 },
      { product: "croquants poulet katsu", pieces: 4 },
      {
        product: "cali aiguillette sweet&chili",
        pieces: 4,
      },
      {
        product: "croquants aiguillette sweet&chili",
        pieces: 4,
      },
    ],
  },

  {
    id: "110092",
    name: "PICK’N’DIP",
    items: [
      { product: "springrolls saumon avocat", pieces: 8 },
      { product: "makis saumon", pieces: 8 },
      { product: "cali saumon avocat", pieces: 8 },
      { product: "makis avocat", pieces: 8 },
      { product: "cali thon cuit avocat", pieces: 8 },
    ],
  },

  {
    id: "114001",
    name: "BENTO POISSON",
    items: [
      { product: "perles coco", pieces: 2 },
      { product: "salade de chou", pieces: 80 },
      { product: "sushis saumon", pieces: 6 },
      {
        product: "croquants surimi avocat concombre",
        pieces: 4,
      },
      { product: "cali saumon avocat", pieces: 4 },
    ],
  },
];

/* =========================================================
   PRODUCTS
   Automatically generated from all menus.
========================================================= */

const PRODUCTS = Array.from(
  new Set(
    MENUS.flatMap((menu) =>
      menu.items.map((item) => item.product)
    )
  )
).sort((a, b) => a.localeCompare(b));

/* =========================================================
   HELPERS
========================================================= */

function emptyDay(): DayData {
  return {
    menus: [],
    directRolls: {},
    finalList: {},
  };
}

function getMenu(menuId: string) {
  return MENUS.find((menu) => menu.id === menuId);
}

function piecesToRolls(pieces: number) {
  return Math.ceil(
    pieces / PIECES_PER_ROLL
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function Home() {
  const [day, setDay] = useState<DayData>(
    emptyDay()
  );

  const [tab, setTab] = useState<
    "plan" | "leftover" | "recommendation"
  >("plan");

  const [search, setSearch] = useState("");

  const [yesterdayPlan, setYesterdayPlan] =
    useState<Record<string, number>>({});

  const [yesterdayLeftover, setYesterdayLeftover] =
    useState<Record<string, number>>({});

  const [recommendation, setRecommendation] =
    useState<Record<string, number>>({});

  /* -------------------------------------------------------
     LOAD
  ------------------------------------------------------- */

  useEffect(() => {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      if (parsed?.day) {
        setDay(parsed.day);
      }

      if (parsed?.yesterdayPlan) {
        setYesterdayPlan(
          parsed.yesterdayPlan
        );
      }

      if (parsed?.yesterdayLeftover) {
        setYesterdayLeftover(
          parsed.yesterdayLeftover
        );
      }

      if (parsed?.recommendation) {
        setRecommendation(
          parsed.recommendation
        );
      }
    } catch {
      localStorage.removeItem(
        STORAGE_KEY
      );
    }
  }, []);

  /* -------------------------------------------------------
     SAVE
  ------------------------------------------------------- */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        day,
        yesterdayPlan,
        yesterdayLeftover,
        recommendation,
      })
    );
  }, [
    day,
    yesterdayPlan,
    yesterdayLeftover,
    recommendation,
  ]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredMenus = useMemo(() => {
    const q = search
      .trim()
      .toLowerCase();

    if (!q) return MENUS;

    return MENUS.filter((menu) => {
      if (
        menu.name
          .toLowerCase()
          .includes(q)
      ) {
        return true;
      }

      if (menu.id.includes(q)) {
        return true;
      }

      return menu.items.some(
        (item) =>
          item.product
            .toLowerCase()
            .includes(q)
      );
    });
  }, [search]);

  const filteredProducts = useMemo(() => {
    const q = search
      .trim()
      .toLowerCase();

    if (!q) return PRODUCTS;

    return PRODUCTS.filter((product) =>
      product
        .toLowerCase()
        .includes(q)
    );
  }, [search]);

  /* =======================================================
     CORE PRODUCTION CALCULATION

     MENU QUANTITY × MENU PIECES
                         ↓
                  TOTAL PIECES
                         ↓
                       ÷ 8
                         ↓
                    CEIL = ROLLS

     Individual Roll:
                  1 roll = 8 pieces
  ======================================================= */

  const productionList =
    useMemo<ProductionLine[]>(() => {
      const totals: Record<
        string,
        number
      > = {};

      /* Menu pieces */

      for (const selected of day.menus) {
        const menu = getMenu(
          selected.menuId
        );

        if (!menu) continue;

        for (const item of menu.items) {
          totals[item.product] =
            (totals[item.product] || 0) +
            item.pieces *
              selected.quantity;
        }
      }

      /* Individual rolls */

      for (const [
        product,
        rolls,
      ] of Object.entries(
        day.directRolls
      )) {
        totals[product] =
          (totals[product] || 0) +
          rolls * PIECES_PER_ROLL;
      }

      return Object.entries(totals)
        .filter(
          ([, pieces]) =>
            pieces > 0
        )
        .map(
          ([
            product,
            pieces,
          ]) => ({
            product,
            pieces,
            rolls:
              piecesToRolls(
                pieces
              ),
          })
        )
        .sort((a, b) =>
          a.product.localeCompare(
            b.product
          )
        );
    }, [day]);

  /* =======================================================
     TODAY TOTALS
  ======================================================= */

  const totalPieces =
    productionList.reduce(
      (sum, item) =>
        sum + item.pieces,
      0
    );

  const totalRolls =
    productionList.reduce(
      (sum, item) =>
        sum + item.rolls,
      0
    );

  /* =======================================================
     MENU ACTIONS
  ======================================================= */

  function addMenu(menuId: string) {
    setDay((current) => {
      const existing =
        current.menus.find(
          (item) =>
            item.menuId === menuId
        );

      if (existing) {
        return {
          ...current,
          menus:
            current.menus.map(
              (item) =>
                item.menuId ===
                menuId
                  ? {
                      ...item,
                      quantity:
                        item.quantity +
                        1,
                    }
                  : item
            ),
        };
      }

      return {
        ...current,
        menus: [
          ...current.menus,
          {
            menuId,
            quantity: 1,
          },
        ],
      };
    });
  }

  function changeMenu(
    menuId: string,
    amount: number
  ) {
    setDay((current) => ({
      ...current,
      menus:
        current.menus
          .map((item) =>
            item.menuId === menuId
              ? {
                  ...item,
                  quantity:
                    Math.max(
                      0,
                      item.quantity +
                        amount
                    ),
                }
              : item
          )
          .filter(
            (item) =>
              item.quantity > 0
          ),
    }));
  }

  function setMenuQuantity(
    menuId: string,
    value: string
  ) {
    const quantity = Math.max(
      0,
      Number(value) || 0
    );

    setDay((current) => ({
      ...current,
      menus:
        current.menus
          .map((item) =>
            item.menuId === menuId
              ? {
                  ...item,
                  quantity,
                }
              : item
          )
          .filter(
            (item) =>
              item.quantity > 0
          ),
    }));
  }

  /* =======================================================
     INDIVIDUAL ROLLS
  ======================================================= */

  function addDirectRoll(
    product: string
  ) {
    setDay((current) => ({
      ...current,
      directRolls: {
        ...current.directRolls,
        [product]:
          (current.directRolls[
            product
          ] || 0) + 1,
      },
    }));
  }

  function changeDirectRoll(
    product: string,
    amount: number
  ) {
    setDay((current) => {
      const next = Math.max(
        0,
        (current.directRolls[
          product
        ] || 0) + amount
      );

      const directRolls = {
        ...current.directRolls,
      };

      if (next === 0) {
        delete directRolls[
          product
        ];
      } else {
        directRolls[
          product
        ] = next;
      }

      return {
        ...current,
        directRolls,
      };
    });
  }

  /* =======================================================
     FINAL LIST
  ======================================================= */

  function setFinalRolls(
    product: string,
    value: string
  ) {
    const rolls = Math.max(
      0,
      Number(value) || 0
    );

    setDay((current) => ({
      ...current,
      finalList: {
        ...current.finalList,
        [product]: rolls,
      },
    }));
  }

  function saveTodayPlan() {
    const finalList: Record<
      string,
      number
    > = {};

    for (const item of productionList) {
      finalList[item.product] =
        item.rolls;
    }

    setDay((current) => ({
      ...current,
      finalList,
    }));

    setYesterdayPlan(
      finalList
    );

    alert(
      "Today's production list has been saved."
    );
  }

  /* =======================================================
     YESTERDAY LEFTOVERS
  ======================================================= */

  function openLeftovers() {
    let plan =
      day.finalList;

    /*
      If today's final list has not
      been explicitly saved yet,
      use the automatically calculated
      production list.
    */

    if (
      Object.keys(plan).length ===
      0
    ) {
      plan =
        Object.fromEntries(
          productionList.map(
            (item) => [
              item.product,
              item.rolls,
            ]
          )
        );
    }

    setYesterdayPlan(
      plan
    );

    setTab(
      "leftover"
    );
  }

  function setLeftover(
    product: string,
    value: string
  ) {
    const quantity = Math.max(
      0,
      Number(value) || 0
    );

    setYesterdayLeftover(
      (current) => ({
        ...current,
        [product]:
          quantity,
      })
    );
  }

  /* =======================================================
     RECOMMENDATION

     Yesterday planned rolls
                    -
     Yesterday leftover rolls
                    =
     Recommended rolls

     User can then modify it.
  ======================================================= */

  function generateRecommendation() {
    const result: Record<
      string,
      number
    > = {};

    for (const [
      product,
      planned,
    ] of Object.entries(
      yesterdayPlan
    )) {
      const leftover =
        yesterdayLeftover[
          product
        ] || 0;

      result[product] =
        Math.max(
          0,
          planned - leftover
        );
    }

    setRecommendation(
      result
    );

    setTab(
      "recommendation"
    );
  }

  function saveRecommendation() {
    setDay((current) => ({
      ...current,
      finalList: {
        ...recommendation,
      },
    }));

    alert(
      "Recommendation saved as today's final production list."
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HEADER */}

      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-3xl font-bold">
            🍣 Sushi Production
          </h1>

          <p className="mt-1 text-slate-300">
            Production planning
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* =================================================
            TABS
        ================================================= */}

        <div className="grid gap-3 md:grid-cols-3">
          <button
            onClick={() =>
              setTab("plan")
            }
            className={`rounded-2xl p-5 text-left ${
              tab === "plan"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            <div className="font-bold">
              ① Today's List
            </div>

            <div className="mt-1 text-sm opacity-70">
              Menu + individual rolls
            </div>
          </button>

          <button
            onClick={
              openLeftovers
            }
            className={`rounded-2xl p-5 text-left ${
              tab === "leftover"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            <div className="font-bold">
              ② Yesterday's Leftovers
            </div>

            <div className="mt-1 text-sm opacity-70">
              Enter unsold rolls
            </div>
          </button>

          <button
            onClick={
              generateRecommendation
            }
            className={`rounded-2xl p-5 text-left ${
              tab ===
              "recommendation"
                ? "bg-slate-900 text-white"
                : "bg-white"
            }`}
          >
            <div className="font-bold">
              ③ Recommendation
            </div>

            <div className="mt-1 text-sm opacity-70">
              Planned − leftovers
            </div>
          </button>
        </div>

        {/* =================================================
            TODAY'S LIST
        ================================================= */}

        {tab === "plan" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* SEARCH */}

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">
                Search Menu / Roll
              </h2>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by Menu name, number or roll..."
                className="mt-5 w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-900"
              />

              {/* MENUS */}

              <h3 className="mb-3 mt-7 font-bold text-slate-500">
                MENUS
              </h3>

              <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
                {filteredMenus.map(
                  (menu) => (
                    <button
                      key={
                        menu.id
                      }
                      onClick={() =>
                        addMenu(
                          menu.id
                        )
                      }
                      className="w-full rounded-xl border p-4 text-left transition hover:bg-slate-50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold">
                            {
                              menu.name
                            }
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            #{menu.id}
                          </div>
                        </div>

                        <span className="rounded-lg bg-slate-900 px-3 py-1 text-white">
                          +
                        </span>
                      </div>

                      <div className="mt-3 text-sm leading-6 text-slate-500">
                        {menu.items
                          .map(
                            (
                              item
                            ) =>
                              `${item.product} × ${item.pieces} pcs`
                          )
                          .join(
                            " · "
                          )}
                      </div>
                    </button>
                  )
                )}

                {filteredMenus.length ===
                  0 && (
                  <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                    No Menu found.
                  </div>
                )}
              </div>

              {/* INDIVIDUAL ROLLS */}

              <h3 className="mb-3 mt-7 font-bold text-slate-500">
                INDIVIDUAL ROLLS
              </h3>

              <div className="max-h-80 space-y-2 overflow-y-auto">
                {filteredProducts.map(
                  (product) => (
                    <button
                      key={
                        product
                      }
                      onClick={() =>
                        addDirectRoll(
                          product
                        )
                      }
                      className="flex w-full items-center justify-between rounded-xl border p-4 text-left transition hover:bg-slate-50"
                    >
                      <span>
                        {
                          product
                        }
                      </span>

                      <span className="rounded-lg bg-slate-900 px-3 py-1 text-white">
                        +
                      </span>
                    </button>
                  )
                )}
              </div>
            </section>

            {/* TODAY SELECTION */}

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    Today's Selection
                  </h2>

                  <p className="mt-1 text-slate-500">
                    Menu quantities + individual rolls
                  </p>
                </div>

                <button
                  onClick={
                    saveTodayPlan
                  }
                  className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
                >
                  Save
                </button>
              </div>

              {/* SELECTED MENUS */}

              <h3 className="mt-7 font-bold">
                Selected Menus
              </h3>

              <div className="mt-3 space-y-2">
                {day.menus.length ===
                  0 && (
                  <div className="rounded-xl bg-slate-50 p-5 text-center text-slate-500">
                    No Menu selected.
                  </div>
                )}

                {day.menus.map(
                  (selected) => {
                    const menu =
                      getMenu(
                        selected.menuId
                      );

                    if (!menu)
                      return null;

                    return (
                      <div
                        key={
                          selected.menuId
                        }
                        className="rounded-xl bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="font-semibold">
                              {
                                menu.name
                              }
                            </div>

                            <div className="text-xs text-slate-400">
                              #{menu.id}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                changeMenu(
                                  menu.id,
                                  -1
                                )
                              }
                              className="h-9 w-9 rounded-lg border bg-white"
                            >
                              −
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={
                                selected.quantity
                              }
                              onChange={(
                                event
                              ) =>
                                setMenuQuantity(
                                  menu.id,
                                  event
                                    .target
                                    .value
                                )
                              }
                              className="h-9 w-16 rounded-lg border text-center font-bold"
                            />

                            <button
                              onClick={() =>
                                changeMenu(
                                  menu.id,
                                  1
                                )
                              }
                              className="h-9 w-9 rounded-lg bg-slate-900 text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* INDIVIDUAL ROLLS */}

              <h3 className="mt-7 font-bold">
                Individual Rolls
              </h3>

              <div className="mt-3 space-y-2">
                {Object.entries(
                  day.directRolls
                ).map(
                  ([
                    product,
                    quantity,
                  ]) => (
                    <div
                      key={
                        product
                      }
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                    >
                      <div>
                        <div className="font-semibold">
                          {
                            product
                          }
                        </div>

                        <div className="text-xs text-slate-400">
                          {quantity *
                            PIECES_PER_ROLL} pieces
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            changeDirectRoll(
                              product,
                              -1
                            )
                          }
                          className="h-9 w-9 rounded-lg border bg-white"
                        >
                          −
                        </button>

                        <span className="w-12 text-center font-bold">
                          {
                            quantity
                          }
                        </span>

                        <button
                          onClick={() =>
                            changeDirectRoll(
                              product,
                              1
                            )
                          }
                          className="h-9 w-9 rounded-lg bg-slate-900 text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                )}

                {Object.keys(
                  day.directRolls
                ).length ===
                  0 && (
                  <div className="rounded-xl bg-slate-50 p-5 text-center text-slate-500">
                    No individual roll added.
                  </div>
                )}
              </div>

              {/* PRODUCTION LIST */}

              <div className="mt-8 border-t pt-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      Production List
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      1 roll = 8 pieces
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {
                        totalRolls
                      }{" "}
                      rolls
                    </div>

                    <div className="text-sm text-slate-500">
                      {
                        totalPieces
                      }{" "}
                      pieces
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {productionList.length ===
                    0 && (
                    <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                      Add a Menu or individual Roll above.
                    </div>
                  )}

                  {productionList.map(
                    (item) => {
                      const finalRolls =
                        day.finalList[
                          item.product
                        ] ??
                        item.rolls;

                      return (
                        <div
                          key={
                            item.product
                          }
                          className="rounded-xl border p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <div className="font-semibold">
                                {
                                  item.product
                                }
                              </div>

                              <div className="mt-1 text-sm text-slate-500">
                                Required:{" "}
                                {
                                  item.pieces
                                }{" "}
                                pieces →{" "}
                                {
                                  item.rolls
                                }{" "}
                                rolls
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  setFinalRolls(
                                    item.product,
                                    String(
                                      Math.max(
                                        0,
                                        finalRolls -
                                          1
                                      )
                                    )
                                  )
                                }
                                className="h-10 w-10 rounded-lg border bg-white"
                              >
                                −
                              </button>

                              <input
                                type="number"
                                min="0"
                                value={
                                  finalRolls
                                }
                                onChange={(
                                  event
                                ) =>
                                  setFinalRolls(
                                    item.product,
                                    event
                                      .target
                                      .value
                                  )
                                }
                                className="h-10 w-20 rounded-lg border text-center font-bold"
                              />

                              <button
                                onClick={() =>
                                  setFinalRolls(
                                    item.product,
                                    String(
                                      finalRolls +
                                        1
                                    )
                                  )
                                }
                                className="h-10 w-10 rounded-lg bg-slate-900 text-white"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =================================================
            YESTERDAY LEFTOVERS
        ================================================= */}

        {tab ===
          "leftover" && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">
              Yesterday's Leftovers
            </h2>

            <p className="mt-1 text-slate-500">
              Enter yesterday's unsold rolls.
            </p>

            <div className="mt-7 space-y-3">
              {Object.keys(
                yesterdayPlan
              ).length ===
                0 && (
                <div className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">
                  No saved production plan yet.
                  <br />
                  Go to Today's List and save the plan first.
                </div>
              )}

              {Object.entries(
                yesterdayPlan
              ).map(
                ([
                  product,
                  planned,
                ]) => {
                  const leftover =
                    yesterdayLeftover[
                      product
                    ] || 0;

                  return (
                    <div
                      key={
                        product
                      }
                      className="grid gap-4 rounded-2xl bg-slate-50 p-5 md:grid-cols-4 md:items-center"
                    >
                      <div className="font-semibold">
                        {
                          product
                        }
                      </div>

                      <div className="text-slate-500">
                        Planned
                        <strong className="ml-2 text-slate-900">
                          {
                            planned
                          }{" "}
                          rolls
                        </strong>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">
                          Leftover
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={
                            leftover
                          }
                          onChange={(
                            event
                          ) =>
                            setLeftover(
                              product,
                              event
                                .target
                                .value
                            )
                          }
                          className="w-full rounded-xl border px-4 py-3 text-center font-bold"
                        />
                      </div>

                      <div className="text-right">
                        <div className="text-xs uppercase text-slate-400">
                          Recommended
                        </div>

                        <div className="text-2xl font-bold">
                          {Math.max(
                            0,
                            planned -
                              leftover
                          )}{" "}
                          rolls
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {Object.keys(
              yesterdayPlan
            ).length >
              0 && (
              <button
                onClick={
                  generateRecommendation
                }
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 font-bold text-white"
              >
                Generate Today's Recommendation
              </button>
            )}
          </section>
        )}

        {/* =================================================
            RECOMMENDATION
        ================================================= */}

        {tab ===
          "recommendation" && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  Today's Recommendation
                </h2>

                <p className="mt-1 text-slate-500">
                  Yesterday planned − yesterday leftovers
                </p>
              </div>

              <button
                onClick={
                  saveRecommendation
                }
                className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
              >
                Save Final List
              </button>
            </div>

            <div className="mt-7 space-y-3">
              {Object.entries(
                recommendation
              ).length ===
                0 && (
                <div className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">
                  No recommendation yet.
                  <br />
                  Enter yesterday's leftovers first.
                </div>
              )}

              {Object.entries(
                recommendation
              ).map(
                ([
                  product,
                  quantity,
                ]) => {
                  const planned =
                    yesterdayPlan[
                      product
                    ] || 0;

                  const leftover =
                    yesterdayLeftover[
                      product
                    ] || 0;

                  return (
                    <div
                      key={
                        product
                      }
                      className="rounded-2xl bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold">
                            {
                              product
                            }
                          </div>

                          <div className="mt-1 text-sm text-slate-500">
                            {
                              planned
                            }{" "}
                            planned −{" "}
                            {
                              leftover
                            }{" "}
                            leftover = recommended
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setRecommendation(
                                (
                                  current
                                ) => ({
                                  ...current,
                                  [product]:
                                    Math.max(
                                      0,
                                      quantity -
                                        1
                                    ),
                                })
                              )
                            }
                            className="h-11 w-11 rounded-lg border bg-white text-xl"
                          >
                            −
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={
                              quantity
                            }
                            onChange={(
                              event
                            ) =>
                              setRecommendation(
                                (
                                  current
                                ) => ({
                                  ...current,
                                  [product]:
                                    Math.max(
                                      0,
                                      Number(
                                        event
                                          .target
                                          .value
                                      ) ||
                                        0
                                    ),
                                })
                              )
                            }
                            className="h-11 w-24 rounded-lg border text-center font-bold"
                          />

                          <button
                            onClick={() =>
                              setRecommendation(
                                (
                                  current
                                ) => ({
                                  ...current,
                                  [product]:
                                    quantity +
                                    1,
                                })
                              )
                            }
                            className="h-11 w-11 rounded-lg bg-slate-900 text-xl text-white"
                          >
                            +
                          </button>

                          <span className="ml-2 font-semibold">
                            rolls
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {Object.keys(
              recommendation
            ).length >
              0 && (
              <button
                onClick={
                  saveRecommendation
                }
                className="mt-8 w-full rounded-2xl bg-slate-900 py-4 font-bold text-white"
              >
                Save Today's Final Production List
              </button>
            )}
          </section>
        )}
      </div>
    </main>
  );
}