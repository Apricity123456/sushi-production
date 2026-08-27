"use client";

import { useEffect, useMemo, useState } from "react";

const PIECES_PER_ROLL = 8;
const STORAGE_KEY = "sushi-production-v6";

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
  date: string;
  menus: SelectedMenu[];
  directRolls: Record<string, number>;
  leftovers: Record<string, number>;
  manualProduction: Record<string, number>;
};

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
      {
        product: "cali surimi avocat concombre",
        pieces: 4,
      },
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
      { product: "dragonrolls tempura", pieces: 4 },
      { product: "sushis saumon", pieces: 2 },
    ],
  },
  {
    id: "110057",
    name: "BOX SPICY",
    items: [
      { product: "cali saumon avocat", pieces: 4 },
      { product: "mayo spicy", pieces: 4 / 4 },
      { product: "sushis saumon", pieces: 3 },
      { product: "mayo spicy", pieces: 3 / 4 },
      { product: "makis concombre", pieces: 4 },
      { product: "mayo spicy", pieces: 4 / 4 },
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
      { product: "sauce wasabi", pieces: 3 / 4 },
      { product: "makis avocat", pieces: 4 },
      { product: "sauce wasabi", pieces: 4 / 4 },
      { product: "springrolls saumon avocat", pieces: 4 },
      { product: "sauce wasabi", pieces: 4 / 4 },
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
      {
        product: "croquants thon cuit avocat",
        pieces: 8,
      },
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
      { product: "dragon roll tempura", pieces: 8 },
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
        product:
          "springrolls thon cuit mayonnaise avocat",
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
        product:
          "springrolls thon cuit mayonnaise avocat",
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
      { product: "cali provola fumée veggie", pieces: 4 },
      {
        product:
          "springrolls thon cuit mayonnaise avocat",
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
        product:
          "springrolls crunchy thon cuit mayonnaise avocat",
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

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function emptyDay(): DayData {
  return {
    date: todayKey(),
    menus: [],
    directRolls: {},
    leftovers: {},
    manualProduction: {},
  };
}

function formatNumber(value: number) {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(3)));
}

function piecesToRolls(pieces: number) {
  return pieces / PIECES_PER_ROLL;
}

function normaliseProductName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export default function HomePage() {
  const [day, setDay] = useState<DayData>(emptyDay());
  const [menuSearch, setMenuSearch] = useState("");
  const [rollSearch, setRollSearch] = useState("");
  const [leftoverSearch, setLeftoverSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [recommendationGenerated, setRecommendationGenerated] =
    useState(false);

  useEffect(() => {
    const key = `${STORAGE_KEY}-${todayKey()}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDay({
          ...emptyDay(),
          ...parsed,
          date: todayKey(),
        });
      } catch {
        setDay(emptyDay());
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const key = `${STORAGE_KEY}-${todayKey()}`;
    localStorage.setItem(key, JSON.stringify(day));
  }, [day, loaded]);

  const selectedMenus = useMemo(() => {
    return day.menus
      .map((selected) => {
        const menu = MENUS.find((m) => m.id === selected.menuId);
        return menu
          ? {
              ...selected,
              menu,
            }
          : null;
      })
      .filter(Boolean) as Array<
      SelectedMenu & { menu: Menu }
    >;
  }, [day.menus]);

  const menuResults = useMemo(() => {
    const q = menuSearch.trim().toLowerCase();

    if (!q) return MENUS.slice(0, 15);

    return MENUS.filter(
      (menu) =>
        menu.name.toLowerCase().includes(q) ||
        menu.id.includes(q)
    ).slice(0, 20);
  }, [menuSearch]);

  const allProducts = useMemo(() => {
    const set = new Set<string>();

    MENUS.forEach((menu) => {
      menu.items.forEach((item) => {
        set.add(normaliseProductName(item.product));
      });
    });

    Object.keys(day.directRolls).forEach((p) => set.add(p));
    Object.keys(day.leftovers).forEach((p) => set.add(p));

    return Array.from(set).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [day.directRolls, day.leftovers]);

  const rollResults = useMemo(() => {
    const q = rollSearch.trim().toLowerCase();

    if (!q) return [];

    return allProducts
      .filter((product) =>
        product.toLowerCase().includes(q)
      )
      .slice(0, 15);
  }, [rollSearch, allProducts]);

  const leftoverResults = useMemo(() => {
    const q = leftoverSearch.trim().toLowerCase();

    if (!q) return [];

    return allProducts
      .filter((product) =>
        product.toLowerCase().includes(q)
      )
      .slice(0, 15);
  }, [leftoverSearch, allProducts]);

  /*
   * TODAY'S PLANNED PRODUCTION
   *
   * Menu quantities are multiplied by pieces.
   * All identical products are merged.
   * pieces / 8 = exact rolls.
   */
  const plannedProduction = useMemo(() => {
    const map: Record<
      string,
      { product: string; pieces: number }
    > = {};

    for (const selected of selectedMenus) {
      for (const item of selected.menu.items) {
        const product = normaliseProductName(item.product);

        if (!map[product]) {
          map[product] = {
            product,
            pieces: 0,
          };
        }

        map[product].pieces +=
          item.pieces * selected.quantity;
      }
    }

    for (const [product, rolls] of Object.entries(
      day.directRolls
    )) {
      if (!map[product]) {
        map[product] = {
          product,
          pieces: 0,
        };
      }

      map[product].pieces +=
        rolls * PIECES_PER_ROLL;
    }

    return Object.values(map)
      .map((item) => ({
        ...item,
        rolls: piecesToRolls(item.pieces),
      }))
      .sort((a, b) =>
        a.product.localeCompare(b.product)
      );
  }, [selectedMenus, day.directRolls]);

  const plannedMap = useMemo(() => {
    const map: Record<string, number> = {};

    plannedProduction.forEach((item) => {
      map[item.product] = item.rolls;
    });

    return map;
  }, [plannedProduction]);

  /*
   * FINAL RECOMMENDATION
   *
   * planned - yesterday leftover
   *
   * If user manually changes final production,
   * manualProduction overrides recommendation.
   */
  const recommendation = useMemo(() => {
    return plannedProduction.map((item) => {
      const leftover = day.leftovers[item.product] || 0;

      const automatic = Math.max(
        item.rolls - leftover,
        0
      );

      const hasManual = Object.prototype.hasOwnProperty.call(
        day.manualProduction,
        item.product
      );

      const finalRolls = hasManual
        ? day.manualProduction[item.product]
        : automatic;

      return {
        ...item,
        leftover,
        automatic,
        finalRolls,
      };
    });
  }, [
    plannedProduction,
    day.leftovers,
    day.manualProduction,
  ]);

  const plannedPieces = plannedProduction.reduce(
    (sum, item) => sum + item.pieces,
    0
  );

  const plannedRolls = plannedProduction.reduce(
    (sum, item) => sum + item.rolls,
    0
  );

  const recommendationRolls = recommendation.reduce(
    (sum, item) => sum + item.finalRolls,
    0
  );

  const recommendationPieces = recommendation.reduce(
    (sum, item) =>
      sum + item.finalRolls * PIECES_PER_ROLL,
    0
  );

  function addMenu(menuId: string) {
    setDay((current) => {
      const existing = current.menus.find(
        (item) => item.menuId === menuId
      );

      return {
        ...current,
        menus: existing
          ? current.menus.map((item) =>
              item.menuId === menuId
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                  }
                : item
            )
          : [
              ...current.menus,
              {
                menuId,
                quantity: 1,
              },
            ],
        manualProduction: {},
      };
    });
  }

  function changeMenu(
    menuId: string,
    amount: number
  ) {
    setDay((current) => ({
      ...current,
      menus: current.menus
        .map((item) =>
          item.menuId === menuId
            ? {
                ...item,
                quantity: Math.max(
                  0,
                  item.quantity + amount
                ),
              }
            : item
        )
        .filter((item) => item.quantity > 0),
      manualProduction: {},
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
      menus: current.menus
        .map((item) =>
          item.menuId === menuId
            ? {
                ...item,
                quantity,
              }
            : item
        )
        .filter((item) => item.quantity > 0),
      manualProduction: {},
    }));
  }

  function removeMenu(menuId: string) {
    setDay((current) => ({
      ...current,
      menus: current.menus.filter(
        (item) => item.menuId !== menuId
      ),
      manualProduction: {},
    }));
  }

  function addDirectRoll(product: string) {
    setDay((current) => ({
      ...current,
      directRolls: {
        ...current.directRolls,
        [product]:
          (current.directRolls[product] || 0) + 1,
      },
      manualProduction: {},
    }));
  }

  function changeDirectRoll(
    product: string,
    amount: number
  ) {
    setDay((current) => {
      const next = Math.max(
        0,
        (current.directRolls[product] || 0) +
          amount
      );

      const directRolls = {
        ...current.directRolls,
      };

      if (next === 0) {
        delete directRolls[product];
      } else {
        directRolls[product] = next;
      }

      return {
        ...current,
        directRolls,
        manualProduction: {},
      };
    });
  }

  function addLeftover(product: string) {
    setDay((current) => ({
      ...current,
      leftovers: {
        ...current.leftovers,
        [product]:
          current.leftovers[product] ?? 0,
      },
    }));

    setLeftoverSearch("");
  }

  function changeLeftover(
    product: string,
    value: string
  ) {
    const number = Math.max(
      0,
      Number(value) || 0
    );

    setDay((current) => ({
      ...current,
      leftovers: {
        ...current.leftovers,
        [product]: number,
      },
    }));
  }

  function removeLeftover(product: string) {
    setDay((current) => {
      const leftovers = {
        ...current.leftovers,
      };

      delete leftovers[product];

      return {
        ...current,
        leftovers,
      };
    });
  }

  function setManualProduction(
    product: string,
    value: string
  ) {
    const number = Math.max(
      0,
      Number(value) || 0
    );

    setDay((current) => ({
      ...current,
      manualProduction: {
        ...current.manualProduction,
        [product]: number,
      },
    }));
  }

  function resetManualProduction() {
    setDay((current) => ({
      ...current,
      manualProduction: {},
    }));
  }

  function generateRecommendation() {
    setRecommendationGenerated(true);
    resetManualProduction();
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#f4f7fb] p-10">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#17233b]">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center gap-10 px-8">
          <a
            href="/"
            className="py-6 text-2xl font-bold"
          >
            Sushi Production
          </a>

          <nav className="flex gap-8">
            <a
              href="/"
              className="border-b-2 border-[#17233b] py-6 font-semibold"
            >
              Production
            </a>
            <a
              href="/analytics"
              className="py-6 text-slate-600"
            >
              Analytics
            </a>
            <a
              href="/inventory"
              className="py-6 text-slate-600"
            >
              Inventory
            </a>
            <a
              href="/recommendations"
              className="py-6 text-slate-600"
            >
              Recommendations
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Daily Production
          </h1>

          <p className="mt-2 text-slate-500">
            {day.date}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ================= MENU ================= */}

          <section className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  1. Today's Menus
                </h2>

                <p className="mt-1 text-slate-500">
                  Search and add today's menus
                </p>
              </div>
            </div>

            <div className="mt-6">
              <input
                value={menuSearch}
                onChange={(e) =>
                  setMenuSearch(e.target.value)
                }
                placeholder="Search menu or code..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#17233b]"
              />
            </div>

            {menuSearch && (
              <div className="mt-3 max-h-64 overflow-auto rounded-xl border">
                {menuResults.map((menu) => (
                  <button
                    key={menu.id}
                    onClick={() => addMenu(menu.id)}
                    className="flex w-full items-center justify-between border-b px-4 py-3 text-left hover:bg-slate-50"
                  >
                    <span>
                      <span className="font-semibold">
                        {menu.name}
                      </span>
                      <span className="ml-3 text-sm text-slate-400">
                        {menu.id}
                      </span>
                    </span>

                    <span className="rounded-lg bg-[#17233b] px-3 py-1 text-sm font-semibold text-white">
                      + Add
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-3">
              {selectedMenus.length === 0 && (
                <div className="rounded-xl bg-slate-50 p-5 text-center text-slate-500">
                  No menu selected
                </div>
              )}

              {selectedMenus.map((item) => (
                <div
                  key={item.menuId}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        {item.menu.name}
                      </div>

                      <div className="text-sm text-slate-400">
                        {item.menu.id}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        removeMenu(item.menuId)
                      }
                      className="text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() =>
                        changeMenu(item.menuId, -1)
                      }
                      className="h-10 w-10 rounded-xl bg-slate-100 text-xl"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        setMenuQuantity(
                          item.menuId,
                          e.target.value
                        )
                      }
                      className="w-20 rounded-xl border px-3 py-2 text-center"
                    />

                    <button
                      onClick={() =>
                        changeMenu(item.menuId, 1)
                      }
                      className="h-10 w-10 rounded-xl bg-slate-100 text-xl"
                    >
                      +
                    </button>

                    <span className="text-slate-500">
                      menus
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* DIRECT ROLLS */}

            <div className="mt-10 border-t pt-8">
              <h3 className="text-xl font-bold">
                Add individual rolls
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Search a roll that is not coming from a menu
              </p>

              <input
                value={rollSearch}
                onChange={(e) =>
                  setRollSearch(e.target.value)
                }
                placeholder="Search individual roll..."
                className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
              />

              {rollSearch && (
                <div className="mt-2 max-h-52 overflow-auto rounded-xl border">
                  {rollResults.map((product) => (
                    <button
                      key={product}
                      onClick={() =>
                        addDirectRoll(product)
                      }
                      className="flex w-full items-center justify-between border-b px-4 py-3 text-left hover:bg-slate-50"
                    >
                      <span>{product}</span>

                      <span className="rounded-lg bg-[#17233b] px-3 py-1 text-sm text-white">
                        + Add
                      </span>
                    </button>
                  ))}

                  {rollResults.length === 0 && (
                    <button
                      onClick={() => {
                        addDirectRoll(
                          normaliseProductName(
                            rollSearch
                          )
                        );
                        setRollSearch("");
                      }}
                      className="w-full px-4 py-3 text-left"
                    >
                      + Add "{rollSearch}"
                    </button>
                  )}
                </div>
              )}

              {Object.entries(day.directRolls).length >
                0 && (
                <div className="mt-4 space-y-2">
                  {Object.entries(
                    day.directRolls
                  ).map(([product, quantity]) => (
                    <div
                      key={product}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                    >
                      <span>{product}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            changeDirectRoll(
                              product,
                              -0.125
                            )
                          }
                          className="h-8 w-8 rounded-lg bg-white"
                        >
                          −
                        </button>

                        <span className="w-20 text-center">
                          {formatNumber(quantity)}
                        </span>

                        <button
                          onClick={() =>
                            changeDirectRoll(
                              product,
                              0.125
                            )
                          }
                          className="h-8 w-8 rounded-lg bg-white"
                        >
                          +
                        </button>

                        <span className="text-sm text-slate-500">
                          roll
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ================= PLANNED ================= */}

          <section className="rounded-3xl bg-white p-8 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold">
                Today's Production List
              </h2>

              <p className="mt-1 text-slate-500">
                Automatically calculated from menus
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">
                  Total pieces
                </div>

                <div className="mt-1 text-3xl font-bold">
                  {formatNumber(plannedPieces)}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">
                  Total rolls
                </div>

                <div className="mt-1 text-3xl font-bold">
                  {formatNumber(plannedRolls)}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {plannedProduction.length === 0 && (
                <div className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">
                  Add menus or individual rolls
                </div>
              )}

              {plannedProduction.map((item) => (
                <div
                  key={item.product}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        {item.product}
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        Required:{" "}
                        {formatNumber(item.pieces)}{" "}
                        pieces →{" "}
                        <strong>
                          {formatNumber(item.rolls)} rolls
                        </strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatNumber(item.rolls)}
                      </div>

                      <div className="text-sm text-slate-400">
                        rolls
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ================= LEFTOVERS ================= */}

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold">
              2. Yesterday's Leftovers
            </h2>

            <p className="mt-1 text-slate-500">
              Search and add only the rolls that actually
              remained yesterday
            </p>
          </div>

          <div className="mt-6 max-w-2xl">
            <input
              value={leftoverSearch}
              onChange={(e) =>
                setLeftoverSearch(e.target.value)
              }
              placeholder="Search roll..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />

            {leftoverSearch && (
              <div className="mt-2 max-h-56 overflow-auto rounded-xl border">
                {leftoverResults.map((product) => (
                  <button
                    key={product}
                    onClick={() =>
                      addLeftover(product)
                    }
                    className="flex w-full items-center justify-between border-b px-4 py-3 text-left hover:bg-slate-50"
                  >
                    <span>{product}</span>

                    <span className="rounded-lg bg-[#17233b] px-3 py-1 text-sm text-white">
                      + Add
                    </span>
                  </button>
                ))}

                {leftoverResults.length === 0 && (
                  <button
                    onClick={() => {
                      addLeftover(
                        normaliseProductName(
                          leftoverSearch
                        )
                      );
                      setLeftoverSearch("");
                    }}
                    className="w-full px-4 py-3 text-left"
                  >
                    + Add "{leftoverSearch}"
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 max-w-3xl space-y-3">
            {Object.keys(day.leftovers).length === 0 && (
              <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                No leftovers entered
              </div>
            )}

            {Object.entries(day.leftovers).map(
              ([product, quantity]) => (
                <div
                  key={product}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="font-semibold">
                    {product}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      step="0.125"
                      value={quantity}
                      onChange={(e) =>
                        changeLeftover(
                          product,
                          e.target.value
                        )
                      }
                      className="w-28 rounded-xl border px-3 py-2 text-center"
                    />

                    <span className="text-slate-500">
                      rolls
                    </span>

                    <button
                      onClick={() =>
                        removeLeftover(product)
                      }
                      className="ml-2 text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          <button
            onClick={generateRecommendation}
            className="mt-8 rounded-xl bg-[#17233b] px-6 py-3 font-semibold text-white"
          >
            Generate Today's Recommendation
          </button>
        </section>

        {/* ================= RECOMMENDATION ================= */}

        {recommendationGenerated && (
          <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  3. Today's Recommended Production
                </h2>

                <p className="mt-1 text-slate-500">
                  Planned − yesterday's leftovers
                </p>
              </div>

              <button
                onClick={resetManualProduction}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
              >
                Reset My Changes
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">
                  Planned
                </div>

                <div className="mt-1 text-2xl font-bold">
                  {formatNumber(plannedRolls)} rolls
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">
                  Recommended
                </div>

                <div className="mt-1 text-2xl font-bold">
                  {formatNumber(
                    recommendationRolls
                  )}{" "}
                  rolls
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">
                  Recommended pieces
                </div>

                <div className="mt-1 text-2xl font-bold">
                  {formatNumber(
                    recommendationPieces
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {recommendation.length === 0 && (
                <div className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">
                  No production to recommend
                </div>
              )}

              {recommendation.map((item) => (
                <div
                  key={item.product}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold">
                        {item.product}
                      </div>

                      <div className="mt-2 text-sm text-slate-500">
                        Planned:{" "}
                        {formatNumber(item.rolls)} rolls
                        {"  "}−{"  "}
                        Leftover:{" "}
                        {formatNumber(item.leftover)} rolls
                        {"  "}={"  "}
                        Recommended:{" "}
                        <strong>
                          {formatNumber(item.automatic)}{" "}
                          rolls
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        step="0.125"
                        value={item.finalRolls}
                        onChange={(e) =>
                          setManualProduction(
                            item.product,
                            e.target.value
                          )
                        }
                        className="w-32 rounded-xl border px-4 py-3 text-center text-lg font-bold"
                      />

                      <span className="text-slate-500">
                        rolls
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}