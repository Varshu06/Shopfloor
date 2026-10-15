type WorkCenterState =
  | "productive"
  | "disturbance"
  | "offline"
  | "setup"
  | "stillstand"
  | "linked";

type WorkCenter = {
  name: string;
  state: WorkCenterState;
};

const assetPath = "/assets";

const icons = {
  logo: `${assetPath}/46745.svg`,
  productive: `${assetPath}/71189.svg`,
  disturbance: `${assetPath}/6b7ac.svg`,
  setup: `${assetPath}/31599.svg`,
  linked: `${assetPath}/187d6.svg`,
  elf: `${assetPath}/55c57.svg`,
  master: `${assetPath}/5df4b.svg`,
  quality: `${assetPath}/03aef.svg`,
  components: `${assetPath}/9f155.svg`,
  carrier: `${assetPath}/8a5c2.svg`,
  legendProductive: `${assetPath}/f4715.svg`,
  legendDisturbance: `${assetPath}/d04cd.svg`,
  legendLinked: `${assetPath}/6128d.svg`,
  legendSetup: `${assetPath}/de49c.svg`,
  legendStripDown: `${assetPath}/ee375.svg`,
  legendElf: `${assetPath}/e52c1.svg`,
  legendMaster: `${assetPath}/b2475.svg`,
  legendQuality: `${assetPath}/430ff.svg`,
  legendComponents: `${assetPath}/3978d.svg`,
  legendCarrier: `${assetPath}/5136c.svg`,
};

const productiveCenters = (count: number): WorkCenter[] =>
  Array.from({ length: count }, () => ({
    name: "6X100",
    state: "productive",
  }));

const areaOneFirstColumn: WorkCenter[] = [
  ...productiveCenters(7),
  { name: "6X100", state: "disturbance" },
  ...productiveCenters(2),
  { name: "6X100", state: "offline" },
  { name: "6X100", state: "productive" },
  { name: "6X100", state: "setup" },
  ...productiveCenters(7),
  { name: "6X200", state: "stillstand" },
  { name: "6X201", state: "linked" },
  { name: "6X202", state: "linked" },
  { name: "6X100", state: "productive" },
];

const areas = [
  {
    name: "Bereich 1",
    columns: [areaOneFirstColumn, productiveCenters(20)],
    showLogisticsCalls: false,
  },
  {
    name: "Bereich 2",
    columns: [productiveCenters(25), productiveCenters(23)],
    showLogisticsCalls: false,
  },
  {
    name: "Bereich 3",
    columns: [productiveCenters(15)],
    showLogisticsCalls: false,
  },
  {
    name: "Bereich 4",
    columns: [productiveCenters(22)],
    showLogisticsCalls: false,
  },
];

function ChecklistIcon({ light = false }: { light?: boolean }) {
  return (
    <span className={`checklist-icon${light ? " checklist-icon--light" : ""}`}>
      <i />
      <i />
      <i />
    </span>
  );
}

function StatusIcon({ state }: { state: WorkCenterState }) {
  if (state === "offline") {
    return <span className="offline-slash" />;
  }

  if (state === "stillstand") {
    return <span className="stillstand-square" />;
  }

  const source = {
    productive: icons.productive,
    disturbance: icons.disturbance,
    setup: icons.setup,
    linked: icons.linked,
  }[state];

  return <img alt="" src={source} />;
}

function CallIcons({
  showLogisticsCalls,
}: {
  showLogisticsCalls: boolean;
}) {
  return (
    <div className="call-icons" aria-hidden="true">
      <img alt="" src={icons.elf} />
      <ChecklistIcon />
      <img alt="" src={icons.master} />
      <img alt="" src={icons.quality} />
      {showLogisticsCalls && <img alt="" src={icons.components} />}
      {showLogisticsCalls && <img alt="" src={icons.carrier} />}
    </div>
  );
}

function WorkCenterCard({
  center,
  showLogisticsCalls,
}: {
  center: WorkCenter;
  showLogisticsCalls: boolean;
}) {
  return (
    <div className={`work-center work-center--${center.state}`}>
      <div className="work-center__label">
        <span className="work-center__status">
          <StatusIcon state={center.state} />
        </span>
        <span className="work-center__name">{center.name}</span>
      </div>
      {center.state !== "offline" && (
        <CallIcons showLogisticsCalls={showLogisticsCalls} />
      )}
    </div>
  );
}

function AreaColumn({
  title,
  centers,
  showLogisticsCalls,
}: {
  title?: string;
  centers: WorkCenter[];
  showLogisticsCalls: boolean;
}) {
  return (
    <div className="area-column">
      <div className="area-column__title">{title}</div>
      <div className="area-column__cards">
        {centers.map((center, index) => (
          <WorkCenterCard
            center={center}
            key={`${center.name}-${center.state}-${index}`}
            showLogisticsCalls={showLogisticsCalls}
          />
        ))}
      </div>
    </div>
  );
}

function Area({
  name,
  columns,
  className,
  showLogisticsCalls,
}: {
  name: string;
  columns: WorkCenter[][];
  className: string;
  showLogisticsCalls: boolean;
}) {
  return (
    <section className={`area ${className}`} aria-label={name}>
      {columns.map((centers, index) => (
        <AreaColumn
          centers={centers}
          key={`${name}-${index}`}
          showLogisticsCalls={showLogisticsCalls}
          title={index === 0 ? name : undefined}
        />
      ))}
    </section>
  );
}

type LegendItem =
  | {
      label: string;
      type: "state";
      state: WorkCenterState | "strip-down";
    }
  | {
      label: string;
      type: "call";
      icon: string | "checklist";
    };

const legendItems: LegendItem[] = [
  { label: "Produktiv", type: "state", state: "productive" },
  { label: "Störung", type: "state", state: "disturbance" },
  { label: "Stillstand", type: "state", state: "stillstand" },
  { label: "Stillstand Verkettung", type: "state", state: "linked" },
  { label: "Rüsten", type: "state", state: "setup" },
  { label: "Abrüsten", type: "state", state: "strip-down" },
  { label: "Offline", type: "state", state: "offline" },
  {
    label: "Erst– / Letztstück–Freigabe",
    type: "call",
    icon: icons.legendElf,
  },
  { label: "Instandhaltung", type: "call", icon: "checklist" },
  {
    label: "Meister / Schichtbetreuer",
    type: "call",
    icon: icons.legendMaster,
  },
  {
    label: "Prüfer / Qualitätsprobleme",
    type: "call",
    icon: icons.legendQuality,
  },
];

function LegendStateIcon({
  state,
}: {
  state: WorkCenterState | "strip-down";
}) {
  const image = {
    productive: icons.legendProductive,
    disturbance: icons.legendDisturbance,
    linked: icons.legendLinked,
    setup: icons.legendSetup,
    "strip-down": icons.legendStripDown,
  }[state];

  return (
    <span className={`legend-state legend-state--${state}`}>
      {state === "offline" && <span className="offline-slash" />}
      {state === "stillstand" && <span className="stillstand-square" />}
      {image && <img alt="" src={image} />}
    </span>
  );
}

function Legend() {
  return (
    <footer className="legend">
      <div className="legend__items">
        {legendItems.map((item, index) => (
          <div
            className={`legend__item${
              index === 7 ? " legend__item--separated" : ""
            }`}
            key={item.label}
          >
            {item.type === "state" ? (
              <LegendStateIcon state={item.state} />
            ) : item.icon === "checklist" ? (
              <span className="legend-call-icon">
                <ChecklistIcon light />
              </span>
            ) : (
              <img className="legend-call-icon" alt="" src={item.icon} />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <main className="viewport">
      <div className="dashboard" data-name="150 AP">
        <header className="dashboard-header">
          <img className="dashboard-header__logo" alt="" src={icons.logo} />
          <h1>Buchbusch</h1>
          <div className="dashboard-header__time">
            <span>Do.&nbsp;&nbsp;21. Nov.</span>
            <strong>13:11:19</strong>
          </div>
        </header>

        <div className="dashboard-areas">
          {areas.map((area, index) => (
            <Area
              className={`area--${index + 1}`}
              columns={area.columns}
              key={area.name}
              name={area.name}
              showLogisticsCalls={area.showLogisticsCalls}
            />
          ))}
        </div>

        <Legend />
      </div>
    </main>
  );
}
