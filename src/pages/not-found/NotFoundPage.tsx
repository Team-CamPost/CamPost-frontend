import { Link } from "react-router-dom";
import { ROUTES } from "../../app/router/paths";

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-white p-8 text-slate-900">
      <h1 className="mb-4 text-2xl font-bold">404 페이지입니다.</h1>
      <Link
        className="text-sm text-[#2046FF]"
        to={ROUTES.home}
      >
        랜딩으로 이동
      </Link>
    </main>
  );
}

export default NotFoundPage;
