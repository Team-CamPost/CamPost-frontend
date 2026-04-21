import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";
import { ROUTES } from "./paths";

function RouteErrorPage() {
  const error = useRouteError();

  let title = "페이지 오류가 발생했습니다.";
  let message = "잠시 후 다시 시도해 주세요.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = typeof error.data === "string" ? error.data : message;
  }

  return (
    <main className="min-h-screen bg-white p-8 text-slate-900">
      <h1 className="mb-3 text-2xl font-bold">{title}</h1>
      <p className="mb-6 text-slate-600">{message}</p>
      <Link
        className="text-[#2046FF]"
        to={ROUTES.home}
      >
        홈으로 이동
      </Link>
    </main>
  );
}

export default RouteErrorPage;
