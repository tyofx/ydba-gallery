# InvenFlow — Inventory & Transaction Management

A production-ready Next.js 14 application for managing inventory and transactions, with separate **Admin** and **Finance** role dashboards.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| State | Zustand (with persist middleware) |
| Charts | Recharts |
| Icons | Lucide React |
| Dates | date-fns |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── login/                  # Login page
│   ├── admin/
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── inventory/          # Inventory CRUD
│   │   └── transactions/       # Transaction management
│   └── finance/
│       ├── dashboard/          # Finance overview + charts
│       ├── transactions/       # Approve / reject transactions
│       └── reports/            # Financial reports
│
├── components/
│   ├── ui/                     # Reusable primitives
│   │   ├── Badge.tsx           # Status + generic badges
│   │   ├── Button.tsx          # Button with variants
│   │   ├── Card.tsx            # Card + StatCard
│   │   ├── Input.tsx           # Input + Select
│   │   ├── Modal.tsx           # Accessible modal
│   │   └── Table.tsx           # Sortable data table
│   ├── layout/
│   │   ├── Sidebar.tsx         # Collapsible sidebar
│   │   ├── Header.tsx          # Top bar
│   │   └── DashboardLayout.tsx # Layout wrapper
│   ├── inventory/
│   │   ├── InventoryFilters.tsx
│   │   ├── InventoryTable.tsx
│   │   └── ItemModal.tsx       # Add/edit item form
│   ├── transactions/
│   │   ├── TransactionFilters.tsx
│   │   ├── TransactionTable.tsx
│   │   └── TransactionDetailModal.tsx
│   └── finance/
│       ├── RevenueChart.tsx    # Area chart
│       └── CategoryChart.tsx   # Donut chart
│
├── store/                      # Zustand stores
│   ├── auth.store.ts
│   ├── inventory.store.ts
│   └── transaction.store.ts
│
├── lib/
│   ├── utils.ts                # cn(), formatCurrency(), etc.
│   └── mock-data.ts            # Seed data
│
└── types/
    └── index.ts                # All TypeScript types
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@company.com` | any |
| Finance | `finance@company.com` | any |

---

## Role Capabilities

### Admin
- View inventory dashboard with KPI stats
- Full CRUD on inventory items (add, edit, delete)
- Create and view transactions
- Filter / sort all data

### Finance
- Financial dashboard with revenue/expense charts
- Approve or reject pending transactions
- View transaction detail with line items
- Generate and export reports

---

## Extending the App

### Connect a real API
Replace mock data in `src/lib/mock-data.ts` and swap Zustand state setters with `fetch` / `axios` calls. The store structure is already shaped like a typical REST response.

### Add authentication middleware
Create `src/middleware.ts` to protect routes:

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");
  if (!token && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = { matcher: ["/admin/:path*", "/finance/:path*"] };
```

### Add a database (Prisma example)
```bash
npm install prisma @prisma/client
npx prisma init
```

Define your schema in `prisma/schema.prisma` mirroring the types in `src/types/index.ts`.
