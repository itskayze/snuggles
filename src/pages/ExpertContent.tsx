import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, BookOpen, Search, Clock } from "lucide-react";
import { EXPERT_ARTICLES, CATEGORIES, Article } from "@/lib/expertContentData";
import { authStore } from "@/stores/authStore";
import { Badge } from "@/components/ui/badge";

const ExpertContent = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(EXPERT_ARTICLES);

  useEffect(() => {
    const state = authStore.getState();
    if (!state.isAuthenticated) {
      navigate("/auth");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    let filtered = EXPERT_ARTICLES;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate("/dashboard")}
          variant="outline"
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 border-2 border-secondary/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Expert Content Hub
              </span>
            </h1>
            <p className="text-muted-foreground">
              Verified educational content from trusted health organizations
            </p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="p-6 gradient-card shadow-soft border-2 hover:shadow-medium transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary">{article.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {article.readTime} min
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{article.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Source: {article.source}</span>
                  <span className="text-xs font-semibold text-primary">{article.ageRange}</span>
                </div>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No articles found matching your criteria</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertContent;
