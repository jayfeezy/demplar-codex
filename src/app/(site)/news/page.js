"use client";
import React, { useEffect, useState } from "react";
import { NewsArticle } from "@/components/NewsArticle";
import { useNotif } from "@/providers/NotifProvider";
import { getNews } from "@/sanity/lib/queries";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useMeta } from "@/providers/MetaContext";

const DemplarApp = () => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const { setTitle, setDescription } = useMeta();

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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
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
            news.map((n, index) => (
              <NewsArticle
                key={n._id}
                entry={n}
                index={index}
                isLatest={index === 0}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DemplarApp;
