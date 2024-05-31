'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchResult {
  id: string;
  url: string;
  title: string;
}

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[] | string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    const response = await fetch(
      'https://onyx--yt-university-app.modal.run/api/search',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      }
    );

    const data = await response.json();
    setLoading(false);
    setResults(data.length ? data : 'Sorry, there are no results');
    console.log(data);
  };

  return (
    <div className="mx-2">
      <div className="flex  w-full max-w-2xl items-center space-x-2">
        <Input
          className="rounded-lg"
          placeholder="Search..."
          type="search"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button className="rounded-lg" type="submit" onClick={handleSearch}>
          <Search />
        </Button>
      </div>

      <div className="mt-10">
        {loading ? (
          <p>Loading...</p>
        ) : (
          results && (
            <ul>
              {Array.isArray(results) ? (
                results.map((result) => (
                  <li key={result.id}>
                    <a href={result.url}>{result.title}</a>
                  </li>
                ))
              ) : (
                <li>{results}</li>
              )}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPage;
