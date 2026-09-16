import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Boxes,
  ChartNoAxesCombined,
  CircleDollarSign,
  CloudCog,
  DatabaseZap,
  FileDown,
  GitBranch,
  KeyRound,
  LayoutDashboard,
  LineChart,
  LockKeyhole,
  Network,
  ShieldCheck,
  TerminalSquare,
  UserCog,
  WalletCards,
} from "lucide-react";

type Icon = typeof WalletCards;
type Page = "overview" | "api" | "cli";
type ApiVersion = "v1" | "v0";

type Feature = {
  icon: Icon;
  title: string;
  body: string;
};

type RoadmapItem = {
  version: string;
  title: string;
  status: "Done" | "Active" | "Next" | "Later";
  detail: string;
};

type ReferenceGroup = {
  label: string;
  icon: Icon;
  description: string;
  items: string[];
};

type EndpointDetail = {
  method: string;
  path: string;
  requestBody: unknown;
  responseBody: unknown;
};

const pageLinks: { page: Page; label: string }[] = [
  { page: "overview", label: "Overview" },
  { page: "api", label: "API Reference" },
  { page: "cli", label: "CLI Reference" },
];

const sectionLinks = [
  { id: "product", label: "Product" },
  { id: "landscape", label: "Landscape" },
  { id: "roadmap", label: "Roadmap" },
  { id: "contribute", label: "Contribute" },
];

const features: Feature[] = [
  {
    icon: WalletCards,
    title: "Cash flow tracking",
    body: "User-scoped income and expense records with date queries, range filters, summaries, pagination, and category links.",
  },
  {
    icon: KeyRound,
    title: "Identity and sessions",
    body: "Local registration, login, refresh tokens, password reset, email change, account deletion, and admin-only access paths.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Statistics surfaces",
    body: "Dashboard, summaries, trends, top expenses, income-expense charts, category distribution, comparison, and heatmaps.",
  },
  {
    icon: FileDown,
    title: "Portability",
    body: "CSV, Excel, PDF, user backup, user restore, and admin database backup/restore flows are part of the core backend surface.",
  },
];

const roadmap: RoadmapItem[] = [
  {
    version: "v0.6.0",
    title: "Beta readiness",
    status: "Done",
    detail: "Service testability, admin lifecycle rules, MongoDB smoke checks, and managed smoke workflow.",
  },
  {
    version: "v0.7.0",
    title: "Observability",
    status: "Done",
    detail: "Request ID propagation and structured request/error logging, with metrics and pprof still tracked as follow-up work.",
  },
  {
    version: "v0.8.0",
    title: "Migration tooling",
    status: "Active",
    detail: "MySQL migration tooling, MongoDB index validation, backup progress, integration tests, and rollback behavior.",
  },
  {
    version: "v0.9.0",
    title: "Performance and caching",
    status: "Next",
    detail: "Category cache invalidation, optional read-through cache, benchmarks, Redis consideration, and query hardening.",
  },
  {
    version: "v1.0.0",
    title: "Stable release",
    status: "Later",
    detail: "Release pipeline, reproducible builds, changelog, and stable API compatibility policy.",
  },
];

const apiGroups: ReferenceGroup[] = [
  {
    label: "System and auth",
    icon: LockKeyhole,
    description: "Public health, version, verification, login, logout, registration, reset, and token-management surfaces.",
    items: [
      "GET /open/health",
      "GET /open/version",
      "POST /open/auth/login",
      "POST /open/auth/register",
      "POST /open/verification/code",
      "POST /open/verification/verify",
      "POST /open/auth/logout",
      "GET /auth/tokens",
      "POST /open/auth/reset-password",
      "POST /open/auth/reset-password/confirm",
    ],
  },
  {
    label: "User",
    icon: UserCog,
    description: "Authenticated profile, configuration, password, email, account, and per-user database operations.",
    items: [
      "GET /user/profile",
      "PUT /user/profile",
      "GET /user/configuration",
      "POST /user/configuration",
      "PUT /user/configuration",
      "PUT /user/password",
      "POST /user/email/change",
      "POST /user/email/confirm",
      "DELETE /user/account",
      "GET /user/database/backup",
      "POST /user/database/restore",
    ],
  },
  {
    label: "Admin",
    icon: ShieldCheck,
    description: "Admin-only user management plus full database backup and restore.",
    items: [
      "POST /admin/user",
      "GET /admin/user",
      "GET /admin/user/{id}",
      "PUT /admin/user/{id}",
      "DELETE /admin/user/{id}",
      "GET /admin/database/backup",
      "POST /admin/database/restore",
    ],
  },
  {
    label: "Cash flow",
    icon: CircleDollarSign,
    description: "Income, expense, list, range, date, entity CRUD, and summary endpoints.",
    items: [
      "POST /cash/expense",
      "POST /cash/income",
      "GET /cash",
      "GET /cash/range",
      "GET /cash/date/{date}",
      "DELETE /cash/date/{date}",
      "GET /cash/{id}",
      "PUT /cash/{id}",
      "DELETE /cash/{id}",
      "GET /cash/summary/total",
      "GET /cash/summary/daily/{date}",
      "GET /cash/summary/monthly/{month}",
      "GET /cash/summary/yearly/{year}",
    ],
  },
  {
    label: "Category",
    icon: Boxes,
    description: "Category CRUD, name lookup, child lookup, and tree endpoints for income and expense categories.",
    items: [
      "POST /category",
      "GET /category",
      "GET /category/name/{name}",
      "GET /category/{parent_id}/children",
      "GET /category/tree",
      "GET /category/{id}",
      "PUT /category/{id}",
      "DELETE /category/{id}",
    ],
  },
  {
    label: "Statistic, chart, and import/export",
    icon: LineChart,
    description: "Analytical views, charts, top lists, dashboard endpoints, and portable data flows.",
    items: [
      "GET /statistic/export",
      "POST /statistic/import",
      "GET /statistic/summary/daily/{date}",
      "GET /statistic/summary/monthly/{month}",
      "GET /statistic/summary/yearly/{year}",
      "GET /statistic/breakdown/daily/{date}",
      "GET /statistic/breakdown/monthly/{month}",
      "GET /statistic/breakdown/yearly/{year}",
      "GET /statistic/trends/daily/{date}",
      "GET /statistic/trends/monthly/{month}",
      "GET /statistic/trends/yearly/{year}",
      "GET /statistic/top/daily/{date}",
      "GET /statistic/top/monthly/{month}",
      "GET /statistic/top/yearly/{year}",
      "GET /statistic/dashboard/{period}/{date}",
      "GET /statistic/chart/income-expense/{period}/{date}",
      "GET /statistic/chart/category-distribution/{period}/{date}",
      "GET /statistic/chart/monthly-comparison/{year}",
      "GET /statistic/chart/spending-heatmap/{year}",
    ],
  },
];

const cliGroups: ReferenceGroup[] = [
  {
    label: "Open",
    icon: TerminalSquare,
    description: "Server startup, health/version checks, public auth, and verification commands.",
    items: [
      "go run main.go open start -p 8080",
      "go run main.go open health",
      "go run main.go open version",
      "go run main.go open verification code --purpose signup --email user@example.com",
      "go run main.go open verification verify --purpose signup --email user@example.com --code <code>",
      "go run main.go open auth register --username alice --password <password> --email user@example.com --verification-token <token>",
      "go run main.go open auth login --username alice --password <password>",
      "go run main.go open auth login --refresh-token <refresh_token>",
      "go run main.go open auth logout",
      "go run main.go open auth reset-password --email-or-username user@example.com",
      "go run main.go open auth reset-password-confirm --token <token> --password <new_password>",
    ],
  },
  {
    label: "Auth and admin",
    icon: ShieldCheck,
    description: "Saved-session token inspection and admin user/database operations.",
    items: [
      "go run main.go auth tokens",
      "go run main.go admin user create --username bob --password <password> --email bob@example.com",
      "go run main.go admin user list --limit 20 --offset 0",
      "go run main.go admin user get --id <user_id>",
      "go run main.go admin user update --id <user_id> --nickname \"Bob\"",
      "go run main.go admin user delete --id <user_id>",
      "go run main.go admin database backup -o backup.json",
      "go run main.go admin database restore -i backup.json --force",
    ],
  },
  {
    label: "User",
    icon: UserCog,
    description: "User profile, configuration, password, email, account, backup, and restore commands.",
    items: [
      "go run main.go user profile get --user <user_id>",
      "go run main.go user profile update --nickname \"Alice\" --gender female --user <user_id>",
      "go run main.go user configuration get --user <user_id>",
      "go run main.go user configuration upsert --currency-code USD --display-language en --active-theme-color \"#2563eb\" --user <user_id>",
      "go run main.go user password --old-password <old_password> --new-password <new_password> --user <user_id>",
      "go run main.go user email change --new-email new@example.com --verification-token <token> --user <user_id>",
      "go run main.go user email confirm --token <token> --password <password> --user <user_id>",
      "go run main.go user account --force --user <user_id>",
      "go run main.go user database backup --output user_backup.json --user <user_id>",
      "go run main.go user database restore --input user_backup.json --user <user_id>",
    ],
  },
  {
    label: "Cash and category",
    icon: CircleDollarSign,
    description: "Cash-flow CRUD, summaries, category CRUD, lookup, and tree commands.",
    items: [
      "go run main.go cash expense -c \"Food\" -a 45.50 -d \"Lunch\"",
      "go run main.go cash income -c \"Salary\" -a 5000",
      "go run main.go cash list --limit 20 --offset 0 --type expense --category-id <category_id> --from-date 2026-01-01 --to-date 2026-01-31 --user <user_id>",
      "go run main.go cash query --id <cash_flow_id>",
      "go run main.go cash query --date 2026-01-01",
      "go run main.go cash range --from 2026-01-01 --to 2026-01-31",
      "go run main.go cash summary --period monthly --date 2026-01",
      "go run main.go cash update --id <cash_flow_id> --amount 50",
      "go run main.go cash delete --id <cash_flow_id>",
      "go run main.go category create -n \"Food\" -t expense --remark \"Daily meals\"",
      "go run main.go category list --type expense",
      "go run main.go category query --id <category_id>",
      "go run main.go category query --name \"Food\"",
      "go run main.go category query --parent <category_id> --type expense",
      "go run main.go category tree --type expense --deep 3",
      "go run main.go category update --id <category_id> --name \"Dining\" --remark \"Restaurants\"",
      "go run main.go category delete --id <category_id>",
    ],
  },
  {
    label: "Statistic",
    icon: LayoutDashboard,
    description: "Summaries, breakdowns, trends, dashboards, chart commands, export, and import.",
    items: [
      "go run main.go statistic summary --period monthly --date 202601 --user <user_id>",
      "go run main.go statistic breakdown --period monthly --date 2026-01 --user <user_id>",
      "go run main.go statistic trends --period yearly --date 2026 --user <user_id>",
      "go run main.go statistic top --period monthly --date 2026-01 --number 10 --user <user_id>",
      "go run main.go statistic dashboard --period monthly --date 2026-01 --user <user_id>",
      "go run main.go statistic chart income-expense --period monthly --date 2026-01 --user <user_id>",
      "go run main.go statistic chart category-distribution --period monthly --date 2026-01 --type expense --user <user_id>",
      "go run main.go statistic chart monthly-comparison --year 2026 --user <user_id>",
      "go run main.go statistic chart spending-heatmap --year 2026 --user <user_id>",
      "go run main.go statistic export --from 20260101 --to 20260131 --format xlsx --output export.xlsx --user <user_id>",
      "go run main.go statistic export --from 20260101 --to 20260131 --format csv --output export.csv --user <user_id>",
      "go run main.go statistic export --from 20260101 --to 20260131 --format pdf --output export.pdf --user <user_id>",
      "go run main.go statistic import --input export.xlsx --user <user_id>",
    ],
  },
  {
    label: "Build",
    icon: CloudCog,
    description: "Build the executable, optionally with version metadata.",
    items: [
      "go build -o cashlenx main.go",
      "go build -ldflags \"-X github.com/macar-x/cashlenx-server/cmd/open_cmd.Version=0.8.0\" -o cashlenx main.go",
    ],
  },
];

const responseExample = `{
  "code": "OK",
  "message": "",
  "data": {},
  "meta": {},
  "extra": {},
  "errors": []
}`;

const createCashExample = (apiBaseUrl: string) => `curl -X POST ${apiBaseUrl}/cash/expense \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"belongs_date":"20260101","category_name":"Food","amount":45.5}'`;

const firstApiEndpoint = apiGroups[0].items[0];

function App() {
  const [page, setPage] = useState<Page>(() => getPageFromHash());

  useEffect(() => {
    const syncPage = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", syncPage);
    return () => window.removeEventListener("hashchange", syncPage);
  }, []);

  const goToPage = (nextPage: Page) => {
    window.location.hash = nextPage === "overview" ? "#top" : `#/${nextPage}-reference`;
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page-shell">
      <Header page={page} goToPage={goToPage} />
      <main id="top">
        {page === "overview" && <Overview goToPage={goToPage} />}
        {page === "api" && <ReferencePage kind="api" />}
        {page === "cli" && <ReferencePage kind="cli" />}
      </main>
    </div>
  );
}

function Header({ page, goToPage }: { page: Page; goToPage: (page: Page) => void }) {
  return (
    <header className="site-header">
      <button className="brand" type="button" onClick={() => goToPage("overview")} aria-label="CashLenX home">
        <span className="brand-mark">
          <img src="/logo_teal.svg" alt="" />
        </span>
        <span>
          <strong>CashLenX</strong>
        </span>
      </button>

      <nav className="site-nav" aria-label="Primary navigation">
        {pageLinks.map((item) => (
          <button
            className={page === item.page ? "active" : ""}
            key={item.page}
            type="button"
            onClick={() => goToPage(item.page)}
          >
            {item.label}
          </button>
        ))}
        {page === "overview" &&
          sectionLinks.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
      </nav>
    </header>
  );
}

function Overview({ goToPage }: { goToPage: (page: Page) => void }) {
  return (
    <>
      <section className="hero section-band" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Personal finance backend and product docs</p>
          <h1 id="hero-title">CashLenX</h1>
          <p className="hero-text">
            A single place for product context, implementation landscape, milestone planning,
            API contracts, and developer workflows.
          </p>
          <div className="hero-actions" aria-label="Document shortcuts">
            <button className="button primary" type="button" onClick={() => goToPage("api")}>
              <BookOpen size={18} />
              API reference
            </button>
            <button className="button secondary" type="button" onClick={() => goToPage("cli")}>
              <TerminalSquare size={18} />
              CLI reference
            </button>
          </div>
        </div>

        <div className="hero-panel" aria-label="CashLenX system snapshot">
          <div className="terminal-bar">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <pre>{`cashlenx
  api: /api/v1
  version: 0.11.0
  storage: mongodb | mysql
  clients: rest | cli | flutter`}</pre>
        </div>
      </section>

      <section className="section" id="product" aria-labelledby="product-title">
        <div className="section-heading">
          <p className="eyebrow">Product</p>
          <h2 id="product-title">Built around practical money records</h2>
          <p>
            CashLenX tracks personal cash flows and turns those records into usable dashboards,
            charts, exports, and account-level operations.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <article className="feature-card" key={feature.title}>
                <FeatureIcon size={24} />
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section split" id="landscape" aria-labelledby="landscape-title">
        <div className="section-heading compact">
          <p className="eyebrow">Landscape</p>
          <h2 id="landscape-title">The current project map</h2>
          <p>
            The backend is a Go service with a Cobra CLI and Gorilla Mux REST API. The Flutter
            client and this documentation site can use the same API contract.
          </p>
        </div>

        <div className="landscape-grid">
          <Landscape icon={Network} title="Interfaces" body="REST API, Cobra CLI, OpenAPI contract, and client-facing smoke workflows." />
          <Landscape icon={DatabaseZap} title="Persistence" body="MongoDB is the supported beta path, with MySQL kept build-compatible." />
          <Landscape icon={ShieldCheck} title="Security" body="JWT access tokens, persisted refresh tokens, route groups, and admin role checks." />
          <Landscape icon={CloudCog} title="Operations" body="Docker Compose profiles, backups, managed smoke checks, and release planning." />
        </div>
      </section>

      <section className="section" id="roadmap" aria-labelledby="roadmap-title">
        <div className="section-heading">
          <p className="eyebrow">Roadmap</p>
          <h2 id="roadmap-title">Milestones toward a stable API</h2>
          <p>
            The stable contract is canonical under /api/v1. The frozen /api/v0 alias keeps
            previously shipped clients working while release readiness is completed.
          </p>
        </div>

        <div className="timeline">
          {roadmap.map((item) => (
            <article className="timeline-item" key={item.version}>
              <div className={`status status-${item.status.toLowerCase()}`}>{item.status}</div>
              <h3>
                <span>{item.version}</span>
                {item.title}
              </h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section api-section" id="api" aria-labelledby="api-title">
        <div className="section-heading">
          <p className="eyebrow">Reference</p>
          <h2 id="api-title">Full references live on their own pages</h2>
          <p>
            The overview stays readable while the API and CLI pages carry the complete route and
            command surfaces.
          </p>
        </div>

        <div className="reference-teaser-grid">
          <Teaser
            icon={BookOpen}
            title="API Reference"
            body="Route groups, base URL, auth rules, response shape, and the full endpoint list."
            onClick={() => goToPage("api")}
          />
          <Teaser
            icon={TerminalSquare}
            title="CLI Reference"
            body="Open, auth, admin, user, cash, category, statistic, import/export, and build commands."
            onClick={() => goToPage("cli")}
          />
        </div>
      </section>

      <section className="section closing" id="contribute" aria-labelledby="contribute-title">
        <div>
          <p className="eyebrow">Contribute</p>
          <h2 id="contribute-title">Ready for real content</h2>
          <p>
            The scaffold can keep growing from static arrays into generated OpenAPI summaries, MDX
            pages, or content loaded from the CashLenX server docs.
          </p>
        </div>
        <button className="button primary" type="button" onClick={() => goToPage("api")}>
          <ArrowRight size={18} />
          View API reference
        </button>
      </section>
    </>
  );
}

function ReferencePage({ kind }: { kind: "api" | "cli" }) {
  const isApi = kind === "api";
  const [apiOrigin, setApiOrigin] = useState("http://localhost:8080");
  const [apiVersion, setApiVersion] = useState<ApiVersion>("v1");
  const [selectedEndpoint, setSelectedEndpoint] = useState(firstApiEndpoint);
  const groups = isApi ? apiGroups : cliGroups;
  const title = isApi ? "API Reference" : "CLI Reference";
  const apiBaseUrl = `${apiOrigin.replace(/\/+$/, "")}/api/${apiVersion}`;
  const endpointDetail = getEndpointDetail(selectedEndpoint);
  const summary = isApi
    ? "Complete route surface for the canonical /api/v1 contract, grouped by product domain."
    : "Complete command surface for the current Cobra CLI, grouped by workflow.";

  return (
    <>
      <section className="reference-hero section-band">
        <p className="eyebrow">{isApi ? "REST contract" : "Developer workflow"}</p>
        <h1>{title}</h1>
        <p>{summary}</p>
        {isApi && (
          <div className="api-base-control" aria-label="API base URL controls">
            <label>
              <span>Base URL</span>
              <input
                type="url"
                value={apiOrigin}
                onChange={(event) => setApiOrigin(event.target.value)}
                placeholder="http://localhost:8080"
              />
            </label>
            <label>
              <span>API version</span>
              <select
                value={apiVersion}
                onChange={(event) => setApiVersion(event.target.value as ApiVersion)}
              >
                <option value="v1">v1 (canonical)</option>
                <option value="v0">v0 (compatibility)</option>
              </select>
            </label>
            <div>
              <span>Resolved</span>
              <code>{apiBaseUrl}</code>
            </div>
          </div>
        )}
        <div className="reference-meta">
          <span>Version 0.11.0</span>
          <span>{isApi ? `Base URL ${apiBaseUrl}` : "Entrypoint go run main.go"}</span>
          <span>{groups.reduce((total, group) => total + group.items.length, 0)} entries</span>
        </div>
      </section>

      {isApi && (
        <section className="section endpoint-detail-section" aria-label="Selected endpoint details">
          <EndpointDetailPanel endpoint={endpointDetail} apiBaseUrl={apiBaseUrl} />
        </section>
      )}

      <section className="section reference-list" aria-label={title}>
        {groups.map((group) => (
          <ReferenceGroupCard
            key={group.label}
            group={group}
            selectedItem={isApi ? selectedEndpoint : undefined}
            onSelect={isApi ? setSelectedEndpoint : undefined}
          />
        ))}
      </section>
    </>
  );
}

function EndpointDetailPanel({
  endpoint,
  apiBaseUrl,
}: {
  endpoint: EndpointDetail;
  apiBaseUrl: string;
}) {
  const requestUrl = `${apiBaseUrl}${endpoint.path}`;
  return (
    <article className="endpoint-detail-card">
      <div className="endpoint-detail-heading">
        <div>
          <p className="eyebrow">Selected endpoint</p>
          <h2>
            <span className={`method-pill method-${endpoint.method.toLowerCase()}`}>
              {endpoint.method}
            </span>
            {endpoint.path}
          </h2>
        </div>
        <code>{requestUrl}</code>
      </div>

      <div className="endpoint-example-grid">
        <ExampleBlock title="Request URL" value={requestUrl} />
        <ExampleBlock
          title="Request body"
          value={
            endpoint.requestBody
              ? JSON.stringify(endpoint.requestBody, null, 2)
              : "No JSON request body."
          }
        />
        <ExampleBlock
          title="Response JSON"
          value={JSON.stringify(endpoint.responseBody, null, 2)}
        />
        <ExampleBlock title="Curl command" value={createCurlExample(endpoint, requestUrl)} />
      </div>
    </article>
  );
}

function ExampleBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="example-block">
      <h3>{title}</h3>
      <pre>{value}</pre>
    </div>
  );
}

function ReferenceGroupCard({
  group,
  selectedItem,
  onSelect,
}: {
  group: ReferenceGroup;
  selectedItem?: string;
  onSelect?: (item: string) => void;
}) {
  const GroupIcon = group.icon;
  return (
    <article className="reference-card">
      <div className="reference-card-heading">
        <GroupIcon size={22} />
        <div>
          <h2>{group.label}</h2>
          <p>{group.description}</p>
        </div>
      </div>
      <ul>
        {group.items.map((item) => (
          <li className={selectedItem === item ? "selected" : ""} key={item}>
            {onSelect ? (
              <button type="button" onClick={() => onSelect(item)}>
                <code>{item}</code>
              </button>
            ) : (
              <code>{item}</code>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}

function Landscape({ icon: IconComponent, title, body }: { icon: Icon; title: string; body: string }) {
  return (
    <article>
      <IconComponent size={22} />
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function Teaser({
  icon: IconComponent,
  title,
  body,
  onClick,
}: {
  icon: Icon;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button className="teaser-card" type="button" onClick={onClick}>
      <IconComponent size={24} />
      <span>{title}</span>
      <p>{body}</p>
      <ArrowRight size={18} />
    </button>
  );
}

function getPageFromHash(): Page {
  if (window.location.hash.includes("cli-reference")) {
    return "cli";
  }
  if (window.location.hash.includes("api-reference")) {
    return "api";
  }
  return "overview";
}

function getEndpointDetail(endpoint: string): EndpointDetail {
  const [method, path] = endpoint.split(" ");
  const requestBody = getRequestBodyExample(method, path);
  return {
    method,
    path,
    requestBody,
    responseBody: getResponseExample(method, path),
  };
}

function getRequestBodyExample(method: string, path: string): unknown {
  if (method === "GET" || method === "DELETE") {
    return null;
  }

  if (path.includes("/auth/login")) {
    return { username: "alice", password: "cashlenx-demo-password" };
  }
  if (path.includes("/auth/register")) {
    return {
      username: "alice",
      password: "cashlenx-demo-password",
      email: "alice@example.com",
      verification_token: "<verification_token>",
    };
  }
  if (path.includes("/verification/code")) {
    return { purpose: "signup", email: "alice@example.com" };
  }
  if (path.includes("/verification/verify")) {
    return { purpose: "signup", email: "alice@example.com", code: "123456" };
  }
  if (path.includes("/auth/logout")) {
    return { refresh_token: "<refresh_token>" };
  }
  if (path.includes("/reset-password/confirm")) {
    return { token: "<reset_token>", password: "new-cashlenx-password" };
  }
  if (path.includes("/reset-password")) {
    return { email_or_username: "alice@example.com" };
  }
  if (path === "/user/profile") {
    return { nickname: "Alice", gender: "female" };
  }
  if (path === "/user/configuration") {
    return {
      currency_code: "USD",
      display_language: "en",
      active_theme_color: "#2563eb",
    };
  }
  if (path === "/user/password") {
    return { old_password: "current-password", new_password: "new-password" };
  }
  if (path === "/user/email/change") {
    return { new_email: "alice.new@example.com", verification_token: "<verification_token>" };
  }
  if (path === "/user/email/confirm") {
    return { token: "<email_change_token>", password: "current-password" };
  }
  if (path.includes("/database/restore")) {
    return { backup_file: "<multipart file>" };
  }
  if (path === "/admin/user") {
    return { username: "bob", password: "cashlenx-demo-password", email: "bob@example.com" };
  }
  if (path === "/admin/user/{id}") {
    return { nickname: "Bob", email: "bob@example.com" };
  }
  if (path === "/cash/expense" || path === "/cash/income") {
    return {
      belongs_date: "20260101",
      category_name: path.endsWith("income") ? "Salary" : "Food",
      amount: path.endsWith("income") ? 5000 : 45.5,
      description: path.endsWith("income") ? "January salary" : "Lunch",
    };
  }
  if (path === "/cash/{id}") {
    return { amount: 50, description: "Updated record" };
  }
  if (path === "/category") {
    return { name: "Food", type: "expense", remark: "Daily meals" };
  }
  if (path === "/category/{id}") {
    return { name: "Dining", remark: "Restaurants and cafes" };
  }
  if (path === "/statistic/import") {
    return { import_file: "<multipart file>" };
  }

  return { example: "Replace with endpoint-specific fields." };
}

function getResponseExample(method: string, path: string): unknown {
  const data = getResponseDataExample(method, path);
  return {
    code: "OK",
    message: "",
    data,
    meta: {},
    extra: {},
    errors: [],
  };
}

function getResponseDataExample(method: string, path: string): unknown {
  if (path.includes("/health")) {
    return { status: "ok" };
  }
  if (path.includes("/version")) {
    return { version: "0.11.0", api_version: "v1", supported_api_versions: ["v1", "v0"] };
  }
  if (path.includes("/auth/login") || path.includes("/auth/register")) {
    return {
      access_token: "<access_token>",
      refresh_token: "<refresh_token>",
      expires_in: 1800,
    };
  }
  if (path.includes("/auth/tokens")) {
    return [{ id: "token_123", created_at: "2026-01-01T00:00:00Z", current: true }];
  }
  if (path.includes("/user/profile")) {
    return { id: "user_123", username: "alice", nickname: "Alice", email: "alice@example.com" };
  }
  if (path.includes("/configuration")) {
    return { currency_code: "USD", display_language: "en", active_theme_color: "#2563eb" };
  }
  if (path.includes("/cash/summary")) {
    return { income: 5000, expense: 1240.5, balance: 3759.5 };
  }
  if (path.startsWith("/cash")) {
    return { id: "cash_123", type: "expense", amount: 45.5, category_name: "Food" };
  }
  if (path.startsWith("/category")) {
    return { id: "category_123", name: "Food", type: "expense", children: [] };
  }
  if (path.includes("/statistic/chart")) {
    return { labels: ["Jan", "Feb", "Mar"], datasets: [{ name: "expense", data: [420, 390, 510] }] };
  }
  if (path.startsWith("/statistic")) {
    return { period: "monthly", income: 5000, expense: 1240.5, top_categories: [] };
  }
  if (path.startsWith("/admin/user")) {
    return { id: "user_456", username: "bob", role: "user" };
  }
  return method === "DELETE" ? { deleted: true } : { success: true };
}

function createCurlExample(endpoint: EndpointDetail, requestUrl: string): string {
  const headers = [`-H "Accept: application/json"`];
  if (!endpoint.path.startsWith("/open")) {
    headers.push(`-H "Authorization: Bearer <access_token>"`);
  }
  if (endpoint.requestBody) {
    headers.push(`-H "Content-Type: application/json"`);
  }

  const commandParts = [`curl -X ${endpoint.method} ${requestUrl}`, ...headers];
  if (endpoint.requestBody) {
    commandParts.push(`-d '${JSON.stringify(endpoint.requestBody)}'`);
  }
  return commandParts.join(" \\\n  ");
}

export default App;
