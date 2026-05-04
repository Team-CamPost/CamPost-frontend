import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Check,
  Clock3,
  LayoutGrid,
  List,
  Paperclip,
  Search,
  X,
} from "lucide-react";
import { NoticeCard } from "./NoticeCard";
import { ROUTES } from "../../../app/router/paths";
import {
  getCategoryTone,
  getDeadlineBadgeLabel,
  isDeadlinePassed,
  isDeadlineSoon,
} from "../utils/noticeStyle";
import { getDateSortValue } from "../../../shared/utils/date";
import type { NoticeCardData } from "../types/notice";

type NoticeFilter = "recent" | "deadline";
type NoticeView = "card" | "list";
type NoticeOrder = "latest" | "oldest";

const CATEGORY_ORDER = [
  "채용정보",
  "학사공지",
  "행사 및 대회",
  "장학",
  "장학금",
  "채용",
  "취업",
  "학사",
  "행사",
  "대회",
  "일반",
  "미분류",
];

interface LatestNoticeItem extends NoticeCardData {
  summary?: string;
  hasAttachment?: boolean;
}

interface LatestNoticeBoardProps {
  notices: LatestNoticeItem[];
  filter: NoticeFilter;
}

const getFilteredNotices = (
  notices: LatestNoticeItem[],
  filter: NoticeFilter,
) => {
  if (filter === "deadline") {
    return notices.filter((notice) => isDeadlineSoon(notice));
  }

  return [...notices];
};

const getCategoryFilteredNotices = (
  notices: LatestNoticeItem[],
  selectedCategories: string[],
) => {
  if (selectedCategories.length === 0) {
    return notices;
  }

  return notices.filter((notice) =>
    selectedCategories.includes(notice.category),
  );
};

const getSearchFilteredNotices = (
  notices: LatestNoticeItem[],
  searchKeyword: string,
) => {
  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const compactKeyword = normalizedKeyword.replace(/[.\-_\s/]/g, "");

  if (!normalizedKeyword) {
    return notices;
  }

  return notices.filter((notice) => {
    const normalizedTitle = notice.title.toLowerCase();
    const compactTitle = normalizedTitle.replace(/[.\-_\s/]/g, "");

    return (
      normalizedTitle.includes(normalizedKeyword) ||
      (compactKeyword.length > 0 && compactTitle.includes(compactKeyword))
    );
  });
};

const getSortedNotices = (notices: LatestNoticeItem[], order: NoticeOrder) => {
  if (order === "oldest") {
    return [...notices].sort(
      (a, b) => getDateSortValue(a.date) - getDateSortValue(b.date),
    );
  }

  return [...notices].sort(
    (a, b) => getDateSortValue(b.date) - getDateSortValue(a.date),
  );
};

export const LatestNoticeBoard = ({
  notices,
  filter,
}: LatestNoticeBoardProps) => {
  const { departmentId = "" } = useParams();
  const [view, setView] = useState<NoticeView>("card");
  const [order, setOrder] = useState<NoticeOrder>("latest");
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const resolvedView = view;
  const pageSize = 12;

  const filterScopedNotices = useMemo(
    () => getFilteredNotices(notices, filter),
    [notices, filter],
  );

  const categoryOptions = useMemo(() => {
    const categorySet = new Set([
      ...filterScopedNotices.map((notice) => notice.category),
      ...selectedCategories,
    ]);

    return [...categorySet].sort((a, b) => {
      const aIndex = CATEGORY_ORDER.indexOf(a);
      const bIndex = CATEGORY_ORDER.indexOf(b);

      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b, "ko");
      }

      if (aIndex === -1) {
        return 1;
      }

      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    });
  }, [filterScopedNotices, selectedCategories]);

  const filteredNotices = useMemo(
    () => getCategoryFilteredNotices(filterScopedNotices, selectedCategories),
    [filterScopedNotices, selectedCategories],
  );

  const searchedNotices = useMemo(
    () => getSearchFilteredNotices(filteredNotices, searchKeyword),
    [filteredNotices, searchKeyword],
  );

  const sortedNotices = useMemo(
    () => getSortedNotices(searchedNotices, order),
    [searchedNotices, order],
  );

  const totalPages = Math.max(1, Math.ceil(sortedNotices.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pagedNotices = sortedNotices.slice(pageStart, pageStart + pageSize);

  const title =
    filter === "deadline" ? "마감 임박 공지사항" : "최신 학과 공지사항";
  const description =
    filter === "deadline"
      ? "마감이 가까운 공지를 우선 확인하세요."
      : "최근 등록된 공지를 빠르게 확인하세요.";

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((prevCategory) => prevCategory !== category)
        : [...prevCategories, category],
    );
    setPage(1);
  };

  const handleCategoryClear = () => {
    setSelectedCategories([]);
    setPage(1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchKeyword(searchInput.trim());
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearchKeyword("");
    setPage(1);
  };

  return (
    <section className="scroll-mt-24">
      <div className="mb-5">
        <div>
          <h2 className="text-3xl leading-tight font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {(categoryOptions.length > 0 || selectedCategories.length > 0) && (
          <div
            className="flex flex-wrap items-center gap-1.5"
            aria-label="카테고리 필터"
          >
            {categoryOptions.map((category) => {
              const isSelected = selectedCategories.includes(category);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={`inline-flex h-7 items-center gap-1 rounded-md border px-2 text-[11px] font-semibold transition-colors ${
                    isSelected
                      ? "border-[#2046FF] bg-[#2046FF] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                  aria-pressed={isSelected}
                >
                  {isSelected && <Check size={12} />}
                  {category}
                </button>
              );
            })}

            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={handleCategoryClear}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
                aria-label="카테고리 필터 초기화"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2 sm:ml-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-sm items-center gap-2 sm:w-auto"
          >
            <div className="relative min-w-0 flex-1 sm:w-64">
              <label
                htmlFor="notice-board-search"
                className="sr-only"
              >
                공지 검색
              </label>
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
              />
              <input
                id="notice-board-search"
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="공지 검색"
                className="h-9 w-full rounded-xl border border-slate-200 bg-white pr-9 pl-9 text-sm text-slate-800 shadow-sm transition-colors outline-none placeholder:text-slate-400 focus:border-[#2046FF] focus:ring-3 focus:ring-[#2046FF]/10"
              />
              {(searchInput || searchKeyword) && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  className="absolute top-1/2 right-2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#2046FF] transition-colors hover:bg-[#2046FF]/10"
                  aria-label="검색어 지우기"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-[#2046FF] px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1838d8] focus:ring-3 focus:ring-[#2046FF]/20 focus:outline-none"
            >
              <Search size={14} />
              검색
            </button>
          </form>

          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => {
                setOrder("latest");
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                order === "latest"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              최신순
            </button>
            <button
              type="button"
              onClick={() => {
                setOrder("oldest");
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                order === "oldest"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              오래된 순
            </button>
          </div>

          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => {
                setView("card");
                setPage(1);
              }}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                resolvedView === "card"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              aria-label="카드 보기"
              aria-pressed={resolvedView === "card"}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              onClick={() => {
                setView("list");
                setPage(1);
              }}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                resolvedView === "list"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              aria-label="리스트 보기"
              aria-pressed={resolvedView === "list"}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {sortedNotices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
          검색된 공지가 없습니다.
        </div>
      ) : resolvedView === "card" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {pagedNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              departmentId={departmentId}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {pagedNotices.map((notice, index) => (
              <Link
                key={notice.id}
                to={ROUTES.noticeDetail(departmentId, notice.id)}
                className={`group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 ${
                  index < pagedNotices.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`shrink-0 rounded-md border px-2 py-1 text-xs font-semibold ${getCategoryTone(notice.category)}`}
                  >
                    {notice.category}
                  </span>
                  {(isDeadlineSoon(notice) || isDeadlinePassed(notice)) && (
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-white ${isDeadlinePassed(notice) ? "bg-slate-500" : "bg-orange-500"}`}
                    >
                      <Clock3 size={12} />
                      {getDeadlineBadgeLabel(notice)}
                    </span>
                  )}
                  <span className="truncate text-sm font-medium text-slate-800 group-hover:text-[#2046FF]">
                    {notice.title}
                  </span>
                </div>

                <div className="ml-4 flex shrink-0 items-center gap-4 text-xs text-slate-500">
                  {notice.hasAttachment && <Paperclip size={14} />}
                  <span>{notice.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {sortedNotices.length > pageSize && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition-colors enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`h-8 w-8 rounded-md text-sm font-semibold transition-colors ${
                  pageNumber === currentPage
                    ? "bg-[#2046FF] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition-colors enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
};
