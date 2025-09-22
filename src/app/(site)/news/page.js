"use client";
import React, { useEffect, useState } from "react";
import { NewsArticle } from "@/components/NewsArticle";
import { useNotif } from "@/providers/NotifProvider";
import { getNews } from "@/sanity/lib/queries";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useMeta } from "@/providers/MetaContext";
import ReactPaginate from "react-paginate";

const DemplarApp = () => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const { setTitle, setDescription } = useMeta();
  const [currentItems, setCurrentItems] = useState(news.slice(0, 6));
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    setTitle("News");
    //setDescription("Knights Demplar");
  }, [setTitle, setDescription]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const gnews = await getNews();
        setNews(gnews);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    setCurrentItems(news.slice(start, end));
  }, [news, currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    const aggregateSection = document.getElementById("aggregate");
    if (aggregateSection) {
      const topPosition =
        aggregateSection.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: topPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow border p-6">
        <h3
          id="aggregate"
          className="text-2xl font-bold mb-6 flex items-center"
        >
          <span className="mr-3">📰</span>
          Demplar News & Chronicles
        </h3>

        <div className="space-y-6">
          {news.length === 0 ? (
            // update to loader
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📰</div>
              {!loading ? (
                <>
                  <p className="text-lg">No news articles yet</p>
                  <p className="text-sm">
                    The newsroom awaits its first story...
                  </p>
                </>
              ) : (
                <LoadingSpinner />
              )}
            </div>
          ) : (
            <>
              {currentItems.map((n, index) => (
                <NewsArticle
                  key={n._id}
                  entry={n}
                  index={index}
                  isLatest={index === 0}
                />
              ))}
              <div className="justify-center flex mt-6">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={Math.ceil(news.length / itemsPerPage)}
                  onPageChange={handlePageClick}
                  marginPagesDisplayed={2}
                  containerClassName="flex items-center gap-2 px-2 py-1 mt-2"
                  pageClassName=""
                  pageLinkClassName="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-yellow-100 transition-colors duration-150 cursor-pointer"
                  activeClassName="bg-yellow-400 text-white border-yellow-600"
                  previousClassName=""
                  nextClassName=""
                  previousLinkClassName="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-yellow-100 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  nextLinkClassName="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-yellow-100 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  breakClassName=""
                  breakLinkClassName="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 cursor-pointer"
                  disabledClassName="opacity-50 pointer-events-none"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemplarApp;
