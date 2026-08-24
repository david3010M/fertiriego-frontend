"use client";

import {
  LayoutGrid,
  ShieldUser,
  Package,
  ShoppingCart,
  ShoppingBag,
  Warehouse,
  Activity,
  TrendingUp,
  DollarSign,
  CalendarClock,
  ListChecks,
  Factory,
  Truck,
  Plane,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { TYPE_USER } from "@/pages/type-users/lib/typeUser.interface";
import { useAuthStore } from "@/pages/auth/lib/auth.store";
import { NavUser } from "./nav-user";
import { USER } from "@/pages/users/lib/User.interface";
import { MENU_GROUP } from "@/pages/menu-group/lib/menuGroup.interface";
import { PERMISSION } from "@/pages/permission/lib/permission.interface";
import { COMPANY } from "@/pages/company/lib/company.interface";
import { BRANCH } from "@/pages/branch/lib/branch.interface";
import { WAREHOUSE } from "@/pages/warehouse/lib/warehouse.interface";
import { BRAND } from "@/pages/brand/lib/brand.interface";
import { BOX } from "@/pages/box/lib/box.interface";
import { UNIT } from "@/pages/unit/lib/unit.interface";
import { CATEGORY } from "@/pages/category/lib/category.interface";
import { PRODUCT } from "@/pages/product/lib/product.interface";
import { PRODUCT_TYPE } from "@/pages/product-type/lib/product-type.interface";
import { CLIENT } from "@/pages/client/lib/client.interface";
import { SUPPLIER } from "@/pages/supplier/lib/supplier.interface";
import { WORKER } from "@/pages/worker/lib/worker.interface";
import { DRIVER } from "@/pages/driver/lib/driver.interface";
import { PURCHASE_ORDER } from "@/pages/purchase-order/lib/purchase-order.interface";
import { PURCHASE_ORDER_BATCH } from "@/pages/purchase-order-batch/lib/purchase-order-batch.interface";
import { PURCHASE_SHIPPING_GUIDE } from "@/pages/purchase-shipping-guide/lib/purchase-shipping-guide.interface";
import { SALE } from "@/pages/sale/lib/sale.interface";
import { ACCOUNTS_RECEIVABLE } from "@/pages/accounts-receivable/lib/accounts-receivable.interface";
import { ACCOUNTS_PAYABLE } from "@/pages/accounts-payable/lib/accounts-payable.interface";
import { WAREHOUSE_PRODUCT } from "@/pages/warehouse-product/lib/warehouse-product.interface";
import { WAREHOUSE_DOCUMENT } from "@/pages/warehouse-document/lib/warehouse-document.interface";
import { BOX_SHIFT } from "@/pages/box-shift/lib/box-shift.interface";
import { hasAccessToRoute } from "@/lib/route-access";
import { useEffect, useState } from "react";
import { ENABLE_PERMISSION_VALIDATION } from "@/lib/permissions.config";
import { QUOTATION } from "@/pages/quotation/lib/quotation.interface";
import { ORDER, OrderPendingReportRoute } from "@/pages/order/lib/order.interface";
import { PURCHASE } from "@/pages/purchase/lib/purchase.interface";
import { VEHICLE } from "@/pages/vehicle/lib/vehicle.interface";
import { CREDIT_NOTE } from "@/pages/credit-note/lib/credit-note.interface";
import { DEBIT_NOTE } from "@/pages/debit-note/lib/debit-note.interface";
import { GUIDE } from "@/pages/guide/lib/guide.interface";
import { SHIPPING_GUIDE_CARRIER } from "@/pages/shipping-guide-carrier/lib/shipping-guide-carrier.interface";
import { PRODUCTION_DOCUMENT } from "@/pages/production-document/lib/production-document.interface";
import {
  PRODUCTION_ORDER,
  ProductionOrderPendingRoute,
} from "@/pages/production-order/lib/production-order.interface";
import { PRODUCT_PRICE_CATEGORY } from "@/pages/product-price-category/lib/product-price-category.interface";
import { PRODUCT_TAG } from "@/pages/product-tag/lib/product-tag.interface";
import { CARRIER } from "@/pages/carrier/lib/carrier.interface";
import {
  PREDICTIVE_META,
  PREDICTIVE_ROUTE,
} from "@/pages/predictive/lib/predictive.interface";
import {
  DASHBOARD_META,
  DASHBOARD_MONITORING_ROUTE,
} from "@/pages/dashboard/lib/dashboard.interface";
import { SCHEDULE } from "@/pages/hr-schedule/lib/schedule.interface";
import { ATTENDANCE_META } from "@/pages/hr-attendance/lib/attendance.interface";
import { OVERTIME_META } from "@/pages/hr-overtime/lib/overtime.interface";
import { JUSTIFICATION_META } from "@/pages/hr-justification/lib/justification.interface";
import { PUNCTUALITY_META } from "@/pages/hr-report/lib/report.interface";
import {
  VACATION_META,
  VACATION_CONTROL_META,
} from "@/pages/hr-vacation/lib/vacation.interface";
import { VACATION_REPORT_META } from "@/pages/hr-vacation-report/lib/vacation-report.interface";
import { SALARY } from "@/pages/payroll-salary/lib/salary.interface";
import { INCOME } from "@/pages/payroll-income/lib/income.interface";
import { DEDUCTION } from "@/pages/payroll-deduction/lib/deduction.interface";
import { PAYROLL } from "@/pages/payroll/lib/payroll.interface";

const {
  ICON_REACT: TypeUserIcon,
  ROUTE: TypeUserRoute,
  MODEL: { name: TypeUserTitle },
} = TYPE_USER;

const {
  ICON_REACT: UserIcon,
  ROUTE: UserRoute,
  MODEL: { name: UserTitle },
} = USER;

const {
  ICON_REACT: CompanyIcon,
  ROUTE: CompanyRoute,
  MODEL: { name: CompanyTitle },
} = COMPANY;

const {
  ICON_REACT: MenuGroupIcon,
  ROUTE: MenuGroupRoute,
  MODEL: { plural: MenuGroupTitle },
} = MENU_GROUP;

const {
  ICON_REACT: PermissionIcon,
  ROUTE: PermissionRoute,
  MODEL: { plural: PermissionTitle },
} = PERMISSION;

const {
  ICON_REACT: BranchIcon,
  ROUTE: BranchRoute,
  MODEL: { name: BranchTitle },
} = BRANCH;

const {
  ICON_REACT: WarehouseIcon,
  ROUTE: WarehouseRoute,
  MODEL: { name: WarehouseTitle },
} = WAREHOUSE;

const {
  ICON_REACT: BrandIcon,
  ROUTE: BrandRoute,
  MODEL: { name: BrandTitle },
} = BRAND;

const {
  ICON_REACT: BoxIcon,
  ROUTE: BoxRoute,
  MODEL: { name: BoxTitle },
} = BOX;

const {
  ICON_REACT: UnitIcon,
  ROUTE: UnitRoute,
  MODEL: { name: UnitTitle },
} = UNIT;

const {
  ICON_REACT: CategoryIcon,
  ROUTE: CategoryRoute,
  MODEL: { name: CategoryTitle },
} = CATEGORY;

const {
  ICON_REACT: ProductIcon,
  ROUTE: ProductRoute,
  MODEL: { name: ProductTitle },
} = PRODUCT;

const {
  ICON_REACT: ProductTypeIcon,
  ROUTE: ProductTypeRoute,
  MODEL: { name: ProductTypeTitle },
} = PRODUCT_TYPE;

const {
  ICON_REACT: ClientIcon,
  ROUTE: ClientRoute,
  MODEL: { name: ClientTitle },
} = CLIENT;

const {
  ICON_REACT: SupplierIcon,
  ROUTE: SupplierRoute,
  MODEL: { name: SupplierTitle },
} = SUPPLIER;

const {
  ICON_REACT: WorkerIcon,
  ROUTE: WorkerRoute,
  MODEL: { name: WorkerTitle },
} = WORKER;

const {
  ICON_REACT: DriverIcon,
  ROUTE: DriverRoute,
  MODEL: { name: DriverTitle },
} = DRIVER;

const {
  ICON_REACT: CarrierIcon,
  ROUTE: CarrierRoute,
  MODEL: { name: CarrierTitle },
} = CARRIER;

const {
  ICON_REACT: PurchaseOrderIcon,
  ROUTE: PurchaseOrderRoute,
  MODEL: { name: PurchaseOrderTitle },
} = PURCHASE_ORDER;

const {
  ICON_REACT: PurchaseOrderBatchIcon,
  ROUTE: PurchaseOrderBatchRoute,
  MODEL: { name: PurchaseOrderBatchTitle },
} = PURCHASE_ORDER_BATCH;

const {
  ICON_REACT: PurchaseIcon,
  ROUTE: PurchaseRoute,
  MODEL: { name: PurchasesTitle },
} = PURCHASE;

const {
  ICON_REACT: PurchaseShippingGuideIcon,
  ROUTE: PurchaseShippingGuideRoute,
  MODEL: { name: PurchaseShippingGuideTitle },
} = PURCHASE_SHIPPING_GUIDE;

const {
  ICON_REACT: WarehouseProductIcon,
  ROUTE: WarehouseProductRoute,
  MODEL: { plural: WarehouseProductTitle },
} = WAREHOUSE_PRODUCT;

const {
  ICON_REACT: WarehouseDocumentIcon,
  ROUTE: WarehouseDocumentRoute,
  MODEL: { plural: WarehouseDocumentTitle },
} = WAREHOUSE_DOCUMENT;

const {
  ICON_REACT: BoxShiftIcon,
  ROUTE: BoxShiftRoute,
  MODEL: { plural: BoxShiftTitle },
} = BOX_SHIFT;

const {
  ICON_REACT: QuotationIcon,
  ROUTE: QuotationRoute,
  MODEL: { name: QuotationTitle },
} = QUOTATION;

const {
  ICON_REACT: OrderIcon,
  ROUTE: OrderRoute,
  MODEL: { name: OrderTitle },
} = ORDER;

const {
  ICON_REACT: SaleIcon,
  ROUTE: SaleRoute,
  MODEL: { name: SaleTitle },
} = SALE;

const {
  ROUTE: AccountsReceivableRoute,
  ICON_REACT: AccountsReceivableIcon,
  MODEL: { name: AccountsReceivableTitle },
} = ACCOUNTS_RECEIVABLE;

const {
  ROUTE: AccountsPayableRoute,
  ICON_REACT: AccountsPayableIcon,
  MODEL: { name: AccountsPayableTitle },
} = ACCOUNTS_PAYABLE;

const {
  ICON_REACT: VehicleIcon,
  ROUTE: VehicleRoute,
  MODEL: { name: VehicleTitle },
} = VEHICLE;

const {
  ICON_REACT: CreditNoteIcon,
  ROUTE: CreditNoteRoute,
  MODEL: { name: CreditNoteTitle },
} = CREDIT_NOTE;

const {
  ICON_REACT: DebitNoteIcon,
  ROUTE: DebitNoteRoute,
  MODEL: { name: DebitNoteTitle },
} = DEBIT_NOTE;

const {
  ICON_REACT: GuideIcon,
  ROUTE: GuideRoute,
  MODEL: { name: GuideTitle },
} = GUIDE;

const {
  ICON_REACT: ShippingGuideCarrierIcon,
  ROUTE: ShippingGuideCarrierRoute,
  MODEL: { name: ShippingGuideCarrierTitle },
} = SHIPPING_GUIDE_CARRIER;

const {
  ICON_REACT: ProductionDocumentIcon,
  ROUTE: ProductionDocumentRoute,
  MODEL: { plural: ProductionDocumentTitle },
} = PRODUCTION_DOCUMENT;

const {
  ICON_REACT: ProductionOrderIcon,
  ROUTE: ProductionOrderRoute,
  MODEL: { plural: ProductionOrderTitle },
} = PRODUCTION_ORDER;

const {
  ICON_REACT: ProductPriceCategoryIcon,
  ROUTE: ProductPriceCategoryRoute,
  MODEL: { name: ProductPriceCategoryTitle },
} = PRODUCT_PRICE_CATEGORY;

const {
  ICON_REACT: ProductTagIcon,
  ROUTE: ProductTagRoute,
  MODEL: { name: ProductTagTitle },
} = PRODUCT_TAG;

const {
  ICON_REACT: ScheduleIcon,
  ROUTE: ScheduleRoute,
  MODEL: { name: ScheduleTitle },
} = SCHEDULE;

const {
  ICON_REACT: AttendanceIcon,
  ROUTE: AttendanceRoute,
  MODEL: { name: AttendanceTitle },
} = ATTENDANCE_META;

const {
  ICON_REACT: OvertimeIcon,
  ROUTE: OvertimeRoute,
  MODEL: { name: OvertimeTitle },
} = OVERTIME_META;

const {
  ICON_REACT: JustificationIcon,
  ROUTE: JustificationRoute,
  MODEL: { name: JustificationTitle },
} = JUSTIFICATION_META;

const {
  ICON_REACT: PunctualityIcon,
  ROUTE: PunctualityRoute,
  MODEL: { name: PunctualityTitle },
} = PUNCTUALITY_META;

const {
  ICON_REACT: VacationIcon,
  ROUTE: VacationRoute,
  MODEL: { name: VacationTitle },
} = VACATION_META;

const {
  ICON_REACT: VacationControlIcon,
  ROUTE: VacationControlRoute,
  MODEL: { name: VacationControlTitle },
} = VACATION_CONTROL_META;

const {
  ICON_REACT: VacationReportIcon,
  ROUTE: VacationReportRoute,
  MODEL: { name: VacationReportTitle },
} = VACATION_REPORT_META;

const {
  ICON_REACT: SalaryIcon,
  ROUTE: SalaryRoute,
  MODEL: { plural: SalaryTitle },
} = SALARY;

const {
  ICON_REACT: IncomeIcon,
  ROUTE: IncomeRoute,
  MODEL: { plural: IncomeTitle },
} = INCOME;

const {
  ICON_REACT: DeductionIcon,
  ROUTE: DeductionRoute,
  MODEL: { plural: DeductionTitle },
} = DEDUCTION;

const {
  ICON_REACT: PayrollIcon,
  ROUTE: PayrollRoute,
  MODEL: { plural: PayrollTitle },
} = PAYROLL;

const {
  ICON_REACT: PredictiveIcon,
  MODEL: { name: PredictiveTitle },
} = PREDICTIVE_META;

const {
  ICON_REACT: DashboardMonitoringIcon,
  MODEL: { name: DashboardMonitoringTitle },
} = DASHBOARD_META;

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/inicio",
      icon: LayoutGrid,
      alwaysVisible: true,
    },
    {
      title: "Compras",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: PurchaseOrderTitle,
          url: PurchaseOrderRoute,
          icon: PurchaseOrderIcon,
        },
        {
          title: PurchaseOrderBatchTitle,
          url: PurchaseOrderBatchRoute,
          icon: PurchaseOrderBatchIcon,
        },
        {
          title: PurchasesTitle,
          url: PurchaseRoute,
          icon: PurchaseIcon,
        },
        {
          title: PurchaseShippingGuideTitle,
          url: PurchaseShippingGuideRoute,
          icon: PurchaseShippingGuideIcon,
        },
        {
          title: AccountsPayableTitle,
          url: AccountsPayableRoute,
          icon: AccountsPayableIcon,
        },
      ],
    },
    {
      title: "Ventas",
      url: "#",
      icon: ShoppingBag,
      items: [
        {
          title: QuotationTitle,
          url: QuotationRoute,
          icon: QuotationIcon,
        },
        {
          title: OrderTitle,
          url: OrderRoute,
          icon: OrderIcon,
        },
        {
          title: "Entregas Pendientes",
          url: OrderPendingReportRoute,
          icon: ListChecks,
        },
        {
          title: SaleTitle,
          url: SaleRoute,
          icon: SaleIcon,
        },
        {
          title: CreditNoteTitle,
          url: CreditNoteRoute,
          icon: CreditNoteIcon,
        },
        {
          title: DebitNoteTitle,
          url: DebitNoteRoute,
          icon: DebitNoteIcon,
        },
        {
          title: GuideTitle,
          url: GuideRoute,
          icon: GuideIcon,
        },
        {
          title: ShippingGuideCarrierTitle,
          url: ShippingGuideCarrierRoute,
          icon: ShippingGuideCarrierIcon,
        },
        {
          title: AccountsReceivableTitle,
          url: AccountsReceivableRoute,
          icon: AccountsReceivableIcon,
        },
        {
          title: BoxTitle,
          url: BoxRoute,
          icon: BoxIcon,
        },
        {
          title: BoxShiftTitle,
          url: BoxShiftRoute,
          icon: BoxShiftIcon,
        },
      ],
    },
    {
      title: "Productos",
      url: "#",
      icon: Package,
      items: [
        {
          title: CategoryTitle,
          url: CategoryRoute,
          icon: CategoryIcon,
        },
        {
          title: ProductTitle,
          url: ProductRoute,
          icon: ProductIcon,
        },
        {
          title: ProductTypeTitle,
          url: ProductTypeRoute,
          icon: ProductTypeIcon,
        },
        {
          title: ProductPriceCategoryTitle,
          url: ProductPriceCategoryRoute,
          icon: ProductPriceCategoryIcon,
        },
        {
          title: ProductTagTitle,
          url: ProductTagRoute,
          icon: ProductTagIcon,
        },
        {
          title: BrandTitle,
          url: BrandRoute,
          icon: BrandIcon,
        },
        {
          title: UnitTitle,
          url: UnitRoute,
          icon: UnitIcon,
        },
      ],
    },
    {
      title: "Personas",
      url: "#",
      icon: ClientIcon,
      items: [
        {
          title: ClientTitle,
          url: ClientRoute,
          icon: ClientIcon,
        },
        {
          title: SupplierTitle,
          url: SupplierRoute,
          icon: SupplierIcon,
        },
        {
          title: WorkerTitle,
          url: WorkerRoute,
          icon: WorkerIcon,
        },
      ],
    },
    {
      title: "Logística",
      url: "#",
      icon: Truck,
      items: [
        {
          title: DriverTitle,
          url: DriverRoute,
          icon: DriverIcon,
        },
        {
          title: CarrierTitle,
          url: CarrierRoute,
          icon: CarrierIcon,
        },
        {
          title: VehicleTitle,
          url: VehicleRoute,
          icon: VehicleIcon,
        },
      ],
    },
    {
      title: "Asistencia",
      url: "#",
      icon: CalendarClock,
      items: [
        {
          title: ScheduleTitle,
          url: ScheduleRoute,
          icon: ScheduleIcon,
        },
        {
          title: AttendanceTitle,
          url: AttendanceRoute,
          icon: AttendanceIcon,
        },
        {
          title: OvertimeTitle,
          url: OvertimeRoute,
          icon: OvertimeIcon,
        },
        {
          title: JustificationTitle,
          url: JustificationRoute,
          icon: JustificationIcon,
        },
        {
          title: PunctualityTitle,
          url: PunctualityRoute,
          icon: PunctualityIcon,
        },
      ],
    },
    {
      title: "Vacaciones",
      url: "#",
      icon: Plane,
      items: [
        {
          title: VacationTitle,
          url: VacationRoute,
          icon: VacationIcon,
        },
        {
          title: VacationControlTitle,
          url: VacationControlRoute,
          icon: VacationControlIcon,
        },
        {
          title: VacationReportTitle,
          url: VacationReportRoute,
          icon: VacationReportIcon,
        },
      ],
    },
    {
      title: "Planillas",
      url: "#",
      icon: PayrollIcon,
      items: [
        {
          title: PayrollTitle,
          url: PayrollRoute,
          icon: PayrollIcon,
        },
        {
          title: SalaryTitle,
          url: SalaryRoute,
          icon: SalaryIcon,
        },
        {
          title: IncomeTitle,
          url: IncomeRoute,
          icon: IncomeIcon,
        },
        {
          title: DeductionTitle,
          url: DeductionRoute,
          icon: DeductionIcon,
        },
      ],
    },
    {
      title: "Organización",
      url: "#",
      icon: CompanyIcon,
      items: [
        {
          title: CompanyTitle,
          url: CompanyRoute,
          icon: CompanyIcon,
        },
        {
          title: BranchTitle,
          url: BranchRoute,
          icon: BranchIcon,
        },
      ],
    },
    {
      title: "Inventario",
      url: "#",
      icon: Warehouse,
      items: [
        {
          title: WarehouseTitle,
          url: WarehouseRoute,
          icon: WarehouseIcon,
        },
        {
          title: WarehouseDocumentTitle,
          url: WarehouseDocumentRoute,
          icon: WarehouseDocumentIcon,
        },
        {
          title: WarehouseProductTitle,
          url: WarehouseProductRoute,
          icon: WarehouseProductIcon,
        },
        {
          title: "Kardex",
          url: "/inventario/kardex",
          icon: Activity,
        },
        {
          title: "Inventario Valorizado",
          url: "/inventario/inventario-valorizado",
          icon: Warehouse,
        },
        {
          title: PredictiveTitle,
          url: PREDICTIVE_ROUTE,
          icon: PredictiveIcon,
        },
        {
          title: DashboardMonitoringTitle,
          url: DASHBOARD_MONITORING_ROUTE,
          icon: DashboardMonitoringIcon,
        },
      ],
    },
    {
      title: "Producción",
      url: "#",
      icon: Factory,
      items: [
        {
          title: ProductionDocumentTitle,
          url: ProductionDocumentRoute,
          icon: ProductionDocumentIcon,
        },
        {
          title: ProductionOrderTitle,
          url: ProductionOrderRoute,
          icon: ProductionOrderIcon,
        },
        {
          title: "Pendientes a Producir",
          url: ProductionOrderPendingRoute,
          icon: ListChecks,
        },
        {
          title: "Reporte de Rendimiento",
          url: "/produccion/reporte-rendimiento",
          icon: TrendingUp,
        },
        {
          title: "Reporte de Costos",
          url: "/produccion/reporte-costos",
          icon: DollarSign,
        },
      ],
    },
    {
      title: "Seguridad",
      url: "#",
      icon: ShieldUser,
      items: [
        {
          title: UserTitle,
          url: UserRoute,
          icon: UserIcon,
        },
        {
          title: TypeUserTitle,
          url: TypeUserRoute,
          icon: TypeUserIcon,
        },
        {
          title: MenuGroupTitle,
          url: MenuGroupRoute,
          icon: MenuGroupIcon,
        },
        {
          title: PermissionTitle,
          url: PermissionRoute,
          icon: PermissionIcon,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, access } = useAuthStore();
  const [filteredNav, setFilteredNav] = useState<any[]>([]);

  useEffect(() => {
    if (!ENABLE_PERMISSION_VALIDATION || user?.rol_id === 1) {
      setFilteredNav(data.navMain);
      return;
    }

    if (!access) return;

    const filterNav = (items: any[]): any[] =>
      items.reduce<any[]>((acc, item) => {
        if (item.alwaysVisible) {
          acc.push(item);
          return acc;
        }
        if (item.url === "#" && item.items) {
          const filteredItems = filterNav(item.items);
          if (filteredItems.length > 0) {
            acc.push({ ...item, items: filteredItems });
          }
          return acc;
        }
        if (hasAccessToRoute(access, item.url)) {
          acc.push(item);
        }
        return acc;
      }, []);

    setFilteredNav(filterNav(data.navMain));
  }, [access, user]);

  if (!user) {
    return null; // o spinner
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNav} />
      </SidebarContent>
      <SidebarFooter className="flex md:hidden">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
