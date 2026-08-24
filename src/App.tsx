import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { JSX } from "react";
import HomePage from "./pages/home/components/HomePage";
import LayoutComponent from "./components/layout";
import { ThemeProvider } from "./components/theme-provider";
import { useAuthStore } from "./pages/auth/lib/auth.store";
import LoginPage from "./pages/auth/components/Login";
import TypeUserPage from "./pages/type-users/components/TypeUserPage";
import UserPage from "./pages/users/components/UserPage";
import CompanyPage from "./pages/company/components/CompanyPage";
import BranchPage from "./pages/branch/components/BranchPage";
import WarehousePage from "./pages/warehouse/components/WarehousePage";
import BrandPage from "./pages/brand/components/BrandPage";
import BoxPage from "./pages/box/components/BoxPage";
import UnitPage from "./pages/unit/components/UnitPage";
import CategoryPage from "./pages/category/components/CategoryPage";
import ProductPage from "./pages/product/components/ProductPage";
import ProductAddPage from "./pages/product/components/ProductAddPage";
import ProductEditPage from "./pages/product/components/ProductEditPage";
import ProductDetail from "./pages/product/components/ProductDetail";
import RolePage from "./pages/role/components/RolePage";
import MenuGroupPage from "./pages/menu-group/components/MenuGroupPage";
import PermissionPage from "./pages/permission/components/PermissionPage";
import ClientPage from "./pages/client/components/ClientPage";
import ClientAddPage from "./pages/client/components/ClientAddPage";
import ClientEditPage from "./pages/client/components/ClientEditPage";
import SupplierPage from "./pages/supplier/components/SupplierPage";
import SupplierAddPage from "./pages/supplier/components/SupplierAddPage";
import SupplierEditPage from "./pages/supplier/components/SupplierEditPage";
import WorkerPage from "./pages/worker/components/WorkerPage";
import WorkerAddPage from "./pages/worker/components/WorkerAddPage";
import WorkerEditPage from "./pages/worker/components/WorkerEditPage";
import DriverPage from "./pages/driver/components/DriverPage";
import DriverAddPage from "./pages/driver/components/DriverAddPage";
import DriverEditPage from "./pages/driver/components/DriverEditPage";
import { TYPE_USER } from "./pages/type-users/lib/typeUser.interface";
import { USER } from "./pages/users/lib/User.interface";
import { COMPANY } from "./pages/company/lib/company.interface";
import { BRANCH } from "./pages/branch/lib/branch.interface";
import { WAREHOUSE } from "./pages/warehouse/lib/warehouse.interface";
import { BRAND } from "./pages/brand/lib/brand.interface";
import { BOX } from "./pages/box/lib/box.interface";
import { UNIT } from "./pages/unit/lib/unit.interface";
import { CATEGORY } from "./pages/category/lib/category.interface";
import { PRODUCT } from "./pages/product/lib/product.interface";
import { ROLE } from "./pages/role/lib/role.interface";
import { MENU_GROUP } from "./pages/menu-group/lib/menuGroup.interface";
import { PERMISSION } from "./pages/permission/lib/permission.interface";
import { CLIENT } from "./pages/client/lib/client.interface";
import { SUPPLIER } from "./pages/supplier/lib/supplier.interface";
import { WORKER } from "./pages/worker/lib/worker.interface";
import { DRIVER } from "./pages/driver/lib/driver.interface";
import { ENABLE_PERMISSION_VALIDATION } from "./lib/permissions.config";
import { hasAccessToRoute } from "./lib/route-access";
import { PRODUCT_TYPE } from "./pages/product-type/lib/product-type.interface";
import ProductTypePage from "./pages/product-type/components/ProductTypePage";
import { PURCHASE_ORDER } from "./pages/purchase-order/lib/purchase-order.interface";
import PurchaseOrderPage from "./pages/purchase-order/components/PurchaseOrderPage";
import PurchaseOrderAddPage from "./pages/purchase-order/components/PurchaseOrderAddPage";
import PurchaseOrderEditPage from "./pages/purchase-order/components/PurchaseOrderEditPage";
import { PURCHASE_ORDER_BATCH } from "./pages/purchase-order-batch/lib/purchase-order-batch.interface";
import { PurchaseOrderBatchPage } from "./pages/purchase-order-batch/components";
import { PurchaseRoute } from "./pages/purchase/lib/purchase.interface";
import {
  PurchasePage,
  PurchaseAddPage,
  PurchaseEditPage,
  PurchaseDetailViewPage,
} from "./pages/purchase/components";
import { PurchaseShippingGuideRoute } from "./pages/purchase-shipping-guide/lib/purchase-shipping-guide.interface";
import {
  PurchaseShippingGuidePage,
  PurchaseShippingGuideAddPage,
  PurchaseShippingGuideEditPage,
  PurchaseShippingGuideDetailViewPage,
} from "./pages/purchase-shipping-guide/components";
import { SaleRoute } from "./pages/sale/lib/sale.interface";
import { SalePage, SaleAddPage, SaleEditPage } from "./pages/sale/components";
import SaleManagePage from "./pages/sale/components/SaleManagePage";
import { AccountsReceivableRoute } from "./pages/accounts-receivable/lib/accounts-receivable.interface";
import { AccountsReceivablePage } from "./pages/accounts-receivable/components";
import { AccountsPayableRoute } from "./pages/accounts-payable/lib/accounts-payable.interface";
import { AccountsPayablePage } from "./pages/accounts-payable/components";
import { WAREHOUSE_PRODUCT } from "./pages/warehouse-product/lib/warehouse-product.interface";
import WarehouseProductPage from "./pages/warehouse-product/components/WarehouseProductPage";
import { WAREHOUSE_DOCUMENT } from "./pages/warehouse-document/lib/warehouse-document.interface";
import WarehouseDocumentPage from "./pages/warehouse-document/components/WarehouseDocumentPage";
import WarehouseDocumentAddPage from "./pages/warehouse-document/components/WarehouseDocumentAddPage";
import WarehouseDocumentEditPage from "./pages/warehouse-document/components/WarehouseDocumentEditPage";
import WarehouseDocumentDetailPage from "./pages/warehouse-document/components/WarehouseDocumentDetailPage";
import WarehouseKardexPage from "./pages/warehouse-document/components/WarehouseKardexPage";
import ValuatedInventoryPage from "./pages/warehouse-document/components/ValuatedInventoryPage";
import { BOX_SHIFT } from "./pages/box-shift/lib/box-shift.interface";
import BoxShiftPage from "./pages/box-shift/components/BoxShiftPage";
import BoxShiftDetailPage from "./pages/box-shift/components/BoxShiftDetailPage";
import { QUOTATION } from "./pages/quotation/lib/quotation.interface";
import { ORDER, OrderPendingReportRoute } from "./pages/order/lib/order.interface";
import {
  QuotationAddPage,
  QuotationEditPage,
  QuotationDetailPage,
  QuotationPage,
} from "./pages/quotation/components";
import {
  OrderAddPage,
  OrderEditPage,
  OrderDetailPage,
  OrderPage,
  OrderPendingReportPage,
} from "./pages/order/components";
import { VEHICLE } from "./pages/vehicle/lib/vehicle.interface";
import VehiclePage from "./pages/vehicle/components/VehiclePage";
import { CREDIT_NOTE } from "./pages/credit-note/lib/credit-note.interface";
import CreditNotePage from "./pages/credit-note/components/CreditNotePage";
import CreditNoteAddPage from "./pages/credit-note/components/CreditNoteAddPage";
import CreditNoteEditPage from "./pages/credit-note/components/CreditNoteEditPage";
import { DEBIT_NOTE } from "./pages/debit-note/lib/debit-note.interface";
import DebitNotePage from "./pages/debit-note/components/DebitNotePage";
import DebitNoteAddPage from "./pages/debit-note/components/DebitNoteAddPage";
import DebitNoteEditPage from "./pages/debit-note/components/DebitNoteEditPage";
import { GUIDE } from "./pages/guide/lib/guide.interface";
import GuidePage from "./pages/guide/components/GuidePage";
import GuideAddPage from "./pages/guide/components/GuideAddPage";
import GuideEditPage from "./pages/guide/components/GuideEditPage";
import GuideDetailPage from "./pages/guide/components/GuideDetailPage";
import { SHIPPING_GUIDE_CARRIER } from "./pages/shipping-guide-carrier/lib/shipping-guide-carrier.interface";
import ShippingGuideCarrierPage from "./pages/shipping-guide-carrier/components/ShippingGuideCarrierPage";
import ShippingGuideCarrierAddPage from "./pages/shipping-guide-carrier/components/ShippingGuideCarrierAddPage";
import ShippingGuideCarrierEditPage from "./pages/shipping-guide-carrier/components/ShippingGuideCarrierEditPage";
import ShippingGuideCarrierDetailPage from "./pages/shipping-guide-carrier/components/ShippingGuideCarrierDetailPage";
import { ShippingGuideCarrierDetailRoute } from "./pages/shipping-guide-carrier/lib/shipping-guide-carrier.interface";
import { PRODUCTION_DOCUMENT } from "./pages/production-document/lib/production-document.interface";
import ProductionDocumentPage from "./pages/production-document/components/ProductionDocumentPage";
import ProductionDocumentAddPage from "./pages/production-document/components/ProductionDocumentAddPage";
import ProductionDocumentEditPage from "./pages/production-document/components/ProductionDocumentEditPage";
import ProductionDocumentDetailPage from "./pages/production-document/components/ProductionDocumentDetailPage";
import ProductionDocumentPerformanceReportPage from "./pages/production-document/components/ProductionDocumentPerformanceReportPage";
import ProductionDocumentCostReportPage from "./pages/production-document/components/ProductionDocumentCostReportPage";
import { PRODUCTION_ORDER, ProductionOrderPendingRoute } from "./pages/production-order/lib/production-order.interface";
import ProductionOrderPage from "./pages/production-order/components/ProductionOrderPage";
import ProductionOrderAddPage from "./pages/production-order/components/ProductionOrderAddPage";
import ProductionOrderEditPage from "./pages/production-order/components/ProductionOrderEditPage";
import ProductionOrderDetailPage from "./pages/production-order/components/ProductionOrderDetailPage";
import ProductionOrderPendingPage from "./pages/production-order/components/ProductionOrderPendingPage";
import { PRODUCT_PRICE_CATEGORY } from "./pages/product-price-category/lib/product-price-category.interface";
import ProductPriceCategoryPage from "./pages/product-price-category/components/ProductPriceCategoryPage";
import { CARRIER } from "./pages/carrier/lib/carrier.interface";
import CarrierPage from "./pages/carrier/components/CarrierPage";
import CarrierAddPage from "./pages/carrier/components/CarrierAddPage";
import CarrierEditPage from "./pages/carrier/components/CarrierEditPage";
import { PRODUCT_TAG } from "./pages/product-tag/lib/product-tag.interface";
import ProductTagPage from "./pages/product-tag/components/TagPage";
import {
  PredictivePage,
  PredictiveMetricsPage,
  PredictiveConfigPage,
} from "./pages/predictive/components";
import {
  PREDICTIVE_ROUTE,
  PREDICTIVE_CONFIG_ROUTE,
  PREDICTIVE_METRICS_ROUTE,
} from "./pages/predictive/lib/predictive.interface";
import { DashboardMonitoringPage } from "./pages/dashboard/components";
import { DASHBOARD_MONITORING_ROUTE } from "./pages/dashboard/lib/dashboard.interface";
import SchedulePage from "./pages/hr-schedule/components/SchedulePage";
import { SCHEDULE } from "./pages/hr-schedule/lib/schedule.interface";
import AttendanceLogPage from "./pages/hr-attendance/components/AttendanceLogPage";
import { ATTENDANCE_ROUTE } from "./pages/hr-attendance/lib/attendance.interface";
import JustificationPage from "./pages/hr-justification/components/JustificationPage";
import { JUSTIFICATION_ROUTE } from "./pages/hr-justification/lib/justification.interface";
import PunctualityReportPage from "./pages/hr-report/components/PunctualityReportPage";
import WorkerAttendanceReportPage from "./pages/hr-report/components/WorkerAttendanceReportPage";
import { PUNCTUALITY_ROUTE } from "./pages/hr-report/lib/report.interface";
import VacationPage from "./pages/hr-vacation/components/VacationPage";
import VacationControlPage from "./pages/hr-vacation/components/VacationControlPage";
import {
  VACATION_ROUTE,
  VACATION_CONTROL_ROUTE,
} from "./pages/hr-vacation/lib/vacation.interface";
import VacationReportPage from "./pages/hr-vacation-report/components/VacationReportPage";
import { VACATION_REPORT_ROUTE } from "./pages/hr-vacation-report/lib/vacation-report.interface";
import SalaryPage from "./pages/payroll-salary/components/SalaryPage";
import { SALARY } from "./pages/payroll-salary/lib/salary.interface";
import IncomePage from "./pages/payroll-income/components/IncomePage";
import { INCOME } from "./pages/payroll-income/lib/income.interface";
import DeductionPage from "./pages/payroll-deduction/components/DeductionPage";
import { DEDUCTION } from "./pages/payroll-deduction/lib/deduction.interface";
import PayrollPage from "./pages/payroll/components/PayrollPage";
import PayrollDetailPage from "./pages/payroll/components/PayrollDetailPage";
import { PAYROLL } from "./pages/payroll/lib/payroll.interface";
import WorkerPayrollReportPage from "./pages/payroll-report/components/WorkerPayrollReportPage";
import OvertimePage from "./pages/hr-overtime/components/OvertimePage";
import OvertimeByPersonPage from "./pages/hr-overtime/components/OvertimeByPersonPage";
import { OVERTIME_META } from "./pages/hr-overtime/lib/overtime.interface";

const { ROUTE: TypeUserRoute } = TYPE_USER;
const { ROUTE: UserRoute } = USER;
const { ROUTE: CompanyRoute } = COMPANY;
const { ROUTE: BranchRoute } = BRANCH;
const { ROUTE: WarehouseRoute } = WAREHOUSE;
const { ROUTE: BrandRoute } = BRAND;
const { ROUTE: BoxRoute } = BOX;
const { ROUTE: UnitRoute } = UNIT;
const { ROUTE: CategoryRoute } = CATEGORY;
const { ROUTE: ProductRoute } = PRODUCT;
const { ROUTE: ProductTypeRoute } = PRODUCT_TYPE;
const { ROUTE: RoleRoute } = ROLE;
const { ROUTE: MenuGroupRoute } = MENU_GROUP;
const { ROUTE: PermissionRoute } = PERMISSION;
const { ROUTE: ClientRoute } = CLIENT;
const { ROUTE: SupplierRoute } = SUPPLIER;
const { ROUTE: WorkerRoute } = WORKER;
const { ROUTE: DriverRoute } = DRIVER;
const { ROUTE: CarrierRoute } = CARRIER;
const { ROUTE: PurchaseOrderRoute } = PURCHASE_ORDER;
const { ROUTE: PurchaseOrderBatchRoute } = PURCHASE_ORDER_BATCH;
const { ROUTE: WarehouseProductRoute } = WAREHOUSE_PRODUCT;
const { ROUTE: WarehouseDocumentRoute } = WAREHOUSE_DOCUMENT;
const { ROUTE: BoxShiftRoute } = BOX_SHIFT;
const { ROUTE: QuotationRoute } = QUOTATION;
const { ROUTE: OrderRoute } = ORDER;
const { ROUTE: VehicleRoute } = VEHICLE;
const { ROUTE: CreditNoteRoute } = CREDIT_NOTE;
const { ROUTE: DebitNoteRoute } = DEBIT_NOTE;
const { ROUTE: GuideRoute } = GUIDE;
const { ROUTE_ADD: GuideAddRoute } = GUIDE;
const { ROUTE_UPDATE: GuideUpdateRoute } = GUIDE;
const { ROUTE: ShippingGuideCarrierRoute } = SHIPPING_GUIDE_CARRIER;
const { ROUTE_ADD: ShippingGuideCarrierAddRoute } = SHIPPING_GUIDE_CARRIER;
const { ROUTE_UPDATE: ShippingGuideCarrierUpdateRoute } =
  SHIPPING_GUIDE_CARRIER;
const { ROUTE: ProductionDocumentRoute } = PRODUCTION_DOCUMENT;
const { ROUTE_ADD: ProductionDocumentAddRoute } = PRODUCTION_DOCUMENT;
const { ROUTE_UPDATE: ProductionDocumentUpdateRoute } = PRODUCTION_DOCUMENT;
const { ROUTE: ProductionOrderRoute } = PRODUCTION_ORDER;
const { ROUTE_ADD: ProductionOrderAddRoute } = PRODUCTION_ORDER;
const { ROUTE_UPDATE: ProductionOrderUpdateRoute } = PRODUCTION_ORDER;
const { ROUTE: ProductPriceCategoryRoute } = PRODUCT_PRICE_CATEGORY;
const { ROUTE: ProductTagRoute } = PRODUCT_TAG;
const { ROUTE: ScheduleRoute } = SCHEDULE;
const { ROUTE: SalaryRoute } = SALARY;
const { ROUTE: IncomeRoute } = INCOME;
const { ROUTE: DeductionRoute } = DEDUCTION;
const { ROUTE: PayrollRoute } = PAYROLL;
const { ROUTE: OvertimeRoute } = OVERTIME_META;

function ProtectedRoute({
  children,
  path,
}: {
  children: JSX.Element;
  path?: string;
}) {
  const { token, access, user } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (path && ENABLE_PERMISSION_VALIDATION && user?.rol_id !== 1) {
    if (!access) {
      return <Navigate to="/inicio" replace />;
    }

    const hasAccess = hasAccessToRoute(access, path);
    if (!hasAccess) {
      return <Navigate to="/inicio" replace />;
    }
  }

  return <LayoutComponent>{children}</LayoutComponent>;
}

export default function App() {
  const { token } = useAuthStore();
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route
            path="/login"
            element={token ? <Navigate to="/inicio" /> : <LoginPage />}
          />

          {/* Ruta protegida */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={TypeUserRoute}
            element={
              <ProtectedRoute path={TypeUserRoute}>
                <TypeUserPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={UserRoute}
            element={
              <ProtectedRoute path={UserRoute}>
                <UserPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={CompanyRoute}
            element={
              <ProtectedRoute path={CompanyRoute}>
                <CompanyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={BranchRoute}
            element={
              <ProtectedRoute path={BranchRoute}>
                <BranchPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={WarehouseRoute}
            element={
              <ProtectedRoute path={WarehouseRoute}>
                <WarehousePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={BrandRoute}
            element={
              <ProtectedRoute path={BrandRoute}>
                <BrandPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={BoxRoute}
            element={
              <ProtectedRoute path={BoxRoute}>
                <BoxPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={UnitRoute}
            element={
              <ProtectedRoute path={UnitRoute}>
                <UnitPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={CategoryRoute}
            element={
              <ProtectedRoute path={CategoryRoute}>
                <CategoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ProductRoute}
            element={
              <ProtectedRoute path={ProductRoute}>
                <ProductPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${ProductRoute}/:id`}
            element={
              <ProtectedRoute path={ProductRoute}>
                <ProductDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/productos/agregar"
            element={
              <ProtectedRoute path={ProductRoute}>
                <ProductAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/productos/actualizar/:id"
            element={
              <ProtectedRoute path={ProductRoute}>
                <ProductEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={RoleRoute}
            element={
              <ProtectedRoute path={RoleRoute}>
                <RolePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={MenuGroupRoute}
            element={
              <ProtectedRoute path={MenuGroupRoute}>
                <MenuGroupPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={PermissionRoute}
            element={
              <ProtectedRoute path={PermissionRoute}>
                <PermissionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ClientRoute}
            element={
              <ProtectedRoute path={ClientRoute}>
                <ClientPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clientes/agregar"
            element={
              <ProtectedRoute path={ClientRoute}>
                <ClientAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clientes/editar/:id"
            element={
              <ProtectedRoute path={ClientRoute}>
                <ClientEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={SupplierRoute}
            element={
              <ProtectedRoute path={SupplierRoute}>
                <SupplierPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/proveedores/agregar"
            element={
              <ProtectedRoute path={SupplierRoute}>
                <SupplierAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/proveedores/editar/:id"
            element={
              <ProtectedRoute path={SupplierRoute}>
                <SupplierEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ProductTypeRoute}
            element={
              <ProtectedRoute path={ProductTypeRoute}>
                <ProductTypePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ProductPriceCategoryRoute}
            element={
              <ProtectedRoute path={ProductPriceCategoryRoute}>
                <ProductPriceCategoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ProductTagRoute}
            element={
              <ProtectedRoute path={ProductTagRoute}>
                <ProductTagPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={WorkerRoute}
            element={
              <ProtectedRoute path={WorkerRoute}>
                <WorkerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trabajadores/agregar"
            element={
              <ProtectedRoute path={WorkerRoute}>
                <WorkerAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trabajadores/editar/:id"
            element={
              <ProtectedRoute path={WorkerRoute}>
                <WorkerEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trabajadores/reporte/:id"
            element={
              <ProtectedRoute path={WorkerRoute}>
                <WorkerAttendanceReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ScheduleRoute}
            element={
              <ProtectedRoute path={ScheduleRoute}>
                <SchedulePage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Planillas */}
          <Route
            path={SalaryRoute}
            element={
              <ProtectedRoute path={SalaryRoute}>
                <SalaryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={IncomeRoute}
            element={
              <ProtectedRoute path={IncomeRoute}>
                <IncomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={DeductionRoute}
            element={
              <ProtectedRoute path={DeductionRoute}>
                <DeductionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={PayrollRoute}
            element={
              <ProtectedRoute path={PayrollRoute}>
                <PayrollPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${PayrollRoute}/:id`}
            element={
              <ProtectedRoute path={PayrollRoute}>
                <PayrollDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trabajadores/planilla/:id"
            element={
              <ProtectedRoute path={WorkerRoute}>
                <WorkerPayrollReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trabajadores/horas-extras/:id"
            element={
              <ProtectedRoute path={WorkerRoute}>
                <OvertimeByPersonPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={OvertimeRoute}
            element={
              <ProtectedRoute path={OvertimeRoute}>
                <OvertimePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ATTENDANCE_ROUTE}
            element={
              <ProtectedRoute path={ATTENDANCE_ROUTE}>
                <AttendanceLogPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={JUSTIFICATION_ROUTE}
            element={
              <ProtectedRoute path={JUSTIFICATION_ROUTE}>
                <JustificationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={PUNCTUALITY_ROUTE}
            element={
              <ProtectedRoute path={PUNCTUALITY_ROUTE}>
                <PunctualityReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={VACATION_ROUTE}
            element={
              <ProtectedRoute path={VACATION_ROUTE}>
                <VacationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={VACATION_CONTROL_ROUTE}
            element={
              <ProtectedRoute path={VACATION_CONTROL_ROUTE}>
                <VacationControlPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={VACATION_REPORT_ROUTE}
            element={
              <ProtectedRoute path={VACATION_REPORT_ROUTE}>
                <VacationReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={DriverRoute}
            element={
              <ProtectedRoute path={DriverRoute}>
                <DriverPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logistica/conductores/agregar"
            element={
              <ProtectedRoute path={DriverRoute}>
                <DriverAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logistica/conductores/editar/:id"
            element={
              <ProtectedRoute path={DriverRoute}>
                <DriverEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={CarrierRoute}
            element={
              <ProtectedRoute path={CarrierRoute}>
                <CarrierPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logistica/transportistas/agregar"
            element={
              <ProtectedRoute path={CarrierRoute}>
                <CarrierAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logistica/transportistas/editar/:id"
            element={
              <ProtectedRoute path={CarrierRoute}>
                <CarrierEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={PurchaseOrderRoute}
            element={
              <ProtectedRoute path={PurchaseOrderRoute}>
                <PurchaseOrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={PurchaseOrderBatchRoute}
            element={
              <ProtectedRoute path={PurchaseOrderBatchRoute}>
                <PurchaseOrderBatchPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ordenes-compra/agregar"
            element={
              <ProtectedRoute path={PurchaseOrderRoute}>
                <PurchaseOrderAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ordenes-compra/actualizar/:id"
            element={
              <ProtectedRoute path={PurchaseOrderRoute}>
                <PurchaseOrderEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={PurchaseRoute}
            element={
              <ProtectedRoute path={PurchaseRoute}>
                <PurchasePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/compras/agregar"
            element={
              <ProtectedRoute path={PurchaseRoute}>
                <PurchaseAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/compras/actualizar/:id"
            element={
              <ProtectedRoute path={PurchaseRoute}>
                <PurchaseEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/compras/detalle/:id"
            element={
              <ProtectedRoute path={PurchaseRoute}>
                <PurchaseDetailViewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={PurchaseShippingGuideRoute}
            element={
              <ProtectedRoute path={PurchaseShippingGuideRoute}>
                <PurchaseShippingGuidePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guias-compra/agregar"
            element={
              <ProtectedRoute path={PurchaseShippingGuideRoute}>
                <PurchaseShippingGuideAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guias-compra/actualizar/:id"
            element={
              <ProtectedRoute path={PurchaseShippingGuideRoute}>
                <PurchaseShippingGuideEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guias-compra/detalle/:id"
            element={
              <ProtectedRoute path={PurchaseShippingGuideRoute}>
                <PurchaseShippingGuideDetailViewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={SaleRoute}
            element={
              <ProtectedRoute path={SaleRoute}>
                <SalePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ventas/agregar"
            element={
              <ProtectedRoute path={SaleRoute}>
                <SaleAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ventas/actualizar/:id"
            element={
              <ProtectedRoute path={SaleRoute}>
                <SaleEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ventas/gestionar/:id"
            element={
              <ProtectedRoute path={SaleRoute}>
                <SaleManagePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={AccountsReceivableRoute}
            element={
              <ProtectedRoute path={AccountsReceivableRoute}>
                <AccountsReceivablePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={AccountsPayableRoute}
            element={
              <ProtectedRoute path={AccountsPayableRoute}>
                <AccountsPayablePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={WarehouseProductRoute}
            element={
              <ProtectedRoute path={WarehouseProductRoute}>
                <WarehouseProductPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={WarehouseDocumentRoute}
            element={
              <ProtectedRoute path={WarehouseDocumentRoute}>
                <WarehouseDocumentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventario/documentos-almacen/agregar"
            element={
              <ProtectedRoute path={WarehouseDocumentRoute}>
                <WarehouseDocumentAddPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventario/documentos-almacen/:id"
            element={
              <ProtectedRoute path={WarehouseDocumentRoute}>
                <WarehouseDocumentDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventario/documentos-almacen/actualizar/:id"
            element={
              <ProtectedRoute path={WarehouseDocumentRoute}>
                <WarehouseDocumentEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventario/kardex"
            element={
              <ProtectedRoute path="/inventario/kardex">
                <WarehouseKardexPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventario/inventario-valorizado"
            element={
              <ProtectedRoute path="/inventario/inventario-valorizado">
                <ValuatedInventoryPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Caja Chica */}
          <Route
            path={BoxShiftRoute}
            element={
              <ProtectedRoute path={BoxShiftRoute}>
                <BoxShiftPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/turnos-caja/:id"
            element={
              <ProtectedRoute path={BoxShiftRoute}>
                <BoxShiftDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Cotizaciones */}
          <Route
            path={QuotationRoute}
            element={
              <ProtectedRoute path={QuotationRoute}>
                <QuotationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cotizaciones/agregar"
            element={
              <ProtectedRoute path={QuotationRoute}>
                <QuotationAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cotizaciones/actualizar/:id"
            element={
              <ProtectedRoute path={QuotationRoute}>
                <QuotationEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cotizaciones/:id"
            element={
              <ProtectedRoute path={QuotationRoute}>
                <QuotationDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Pedidos */}
          <Route
            path={OrderRoute}
            element={
              <ProtectedRoute path={OrderRoute}>
                <OrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pedidos/agregar"
            element={
              <ProtectedRoute path={OrderRoute}>
                <OrderAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pedidos/actualizar/:id"
            element={
              <ProtectedRoute path={OrderRoute}>
                <OrderEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pedidos/:id"
            element={
              <ProtectedRoute path={OrderRoute}>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={OrderPendingReportRoute}
            element={
              <ProtectedRoute path={OrderRoute}>
                <OrderPendingReportPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Vehículos */}
          <Route
            path={VehicleRoute}
            element={
              <ProtectedRoute path={VehicleRoute}>
                <VehiclePage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Notas de Crédito */}
          <Route
            path={CreditNoteRoute}
            element={
              <ProtectedRoute path={CreditNoteRoute}>
                <CreditNotePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notas-credito/agregar"
            element={
              <ProtectedRoute path={CreditNoteRoute}>
                <CreditNoteAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notas-credito/actualizar/:id"
            element={
              <ProtectedRoute path={CreditNoteRoute}>
                <CreditNoteEditPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Notas de Débito */}
          <Route
            path={DebitNoteRoute}
            element={
              <ProtectedRoute path={DebitNoteRoute}>
                <DebitNotePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notas-debito/agregar"
            element={
              <ProtectedRoute path={DebitNoteRoute}>
                <DebitNoteAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notas-debito/actualizar/:id"
            element={
              <ProtectedRoute path={DebitNoteRoute}>
                <DebitNoteEditPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Guías de Remisión */}
          <Route
            path={GuideRoute}
            element={
              <ProtectedRoute path={GuideRoute}>
                <GuidePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={GuideAddRoute}
            element={
              <ProtectedRoute path={GuideRoute}>
                <GuideAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={GuideUpdateRoute}
            element={
              <ProtectedRoute path={GuideRoute}>
                <GuideEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${GuideRoute}/:id`}
            element={
              <ProtectedRoute path={GuideRoute}>
                <GuideDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Guías de Transportista */}
          <Route
            path={ShippingGuideCarrierRoute}
            element={
              <ProtectedRoute path={ShippingGuideCarrierRoute}>
                <ShippingGuideCarrierPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ShippingGuideCarrierAddRoute}
            element={
              <ProtectedRoute path={ShippingGuideCarrierRoute}>
                <ShippingGuideCarrierAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ShippingGuideCarrierUpdateRoute}
            element={
              <ProtectedRoute path={ShippingGuideCarrierRoute}>
                <ShippingGuideCarrierEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ShippingGuideCarrierDetailRoute}
            element={
              <ProtectedRoute path={ShippingGuideCarrierRoute}>
                <ShippingGuideCarrierDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Documentos de Producción */}
          <Route
            path={ProductionDocumentRoute}
            element={
              <ProtectedRoute path={ProductionDocumentRoute}>
                <ProductionDocumentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ProductionDocumentAddRoute}
            element={
              <ProtectedRoute path={ProductionDocumentRoute}>
                <ProductionDocumentAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ProductionDocumentUpdateRoute}
            element={
              <ProtectedRoute path={ProductionDocumentRoute}>
                <ProductionDocumentEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/produccion/documentos-produccion/:id"
            element={
              <ProtectedRoute path={ProductionDocumentRoute}>
                <ProductionDocumentDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/produccion/reporte-rendimiento"
            element={
              <ProtectedRoute path="/produccion/reporte-rendimiento">
                <ProductionDocumentPerformanceReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/produccion/reporte-costos"
            element={
              <ProtectedRoute path="/produccion/reporte-costos">
                <ProductionDocumentCostReportPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Órdenes de Producción */}
          <Route
            path={ProductionOrderRoute}
            element={
              <ProtectedRoute path={ProductionOrderRoute}>
                <ProductionOrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ProductionOrderAddRoute}
            element={
              <ProtectedRoute path={ProductionOrderRoute}>
                <ProductionOrderAddPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ProductionOrderUpdateRoute}
            element={
              <ProtectedRoute path={ProductionOrderRoute}>
                <ProductionOrderEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ProductionOrderPendingRoute}
            element={
              <ProtectedRoute path={ProductionOrderPendingRoute}>
                <ProductionOrderPendingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/produccion/ordenes-produccion/:id"
            element={
              <ProtectedRoute path={ProductionOrderRoute}>
                <ProductionOrderDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Motor Predictivo */}
          <Route
            path={PREDICTIVE_ROUTE}
            element={
              <ProtectedRoute path={PREDICTIVE_ROUTE}>
                <PredictivePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={PREDICTIVE_CONFIG_ROUTE}
            element={
              <ProtectedRoute path={PREDICTIVE_ROUTE}>
                <PredictiveConfigPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${PREDICTIVE_METRICS_ROUTE}/:id`}
            element={
              <ProtectedRoute path={PREDICTIVE_ROUTE}>
                <PredictiveMetricsPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Dashboard y Monitoreo */}
          <Route
            path={DASHBOARD_MONITORING_ROUTE}
            element={
              <ProtectedRoute>
                <DashboardMonitoringPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/inicio" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
