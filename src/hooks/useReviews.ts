import { useState, useEffect } from 'react';

export interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  userName?: string;
  date: string;
  isAnonymous: boolean;
}

const REVIEWS_KEY = 'zander-store-reviews';

export const useReviews = (productId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(REVIEWS_KEY);
    if (stored) {
      try {
        const allReviews = JSON.parse(stored);
        if (productId) {
          setReviews(allReviews.filter((r: Review) => r.productId === productId));
        } else {
          setReviews(allReviews);
        }
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
      }
    }
  }, [productId]);

  const saveReviews = (newReviews: Review[]) => {
    const stored = localStorage.getItem(REVIEWS_KEY);
    let allReviews: Review[] = [];
    
    if (stored) {
      try {
        allReviews = JSON.parse(stored);
      } catch (error) {
        console.error('Erro ao carregar avaliações existentes:', error);
      }
    }

    // Remove reviews antigas do produto específico e adiciona as novas
    if (productId) {
      allReviews = allReviews.filter(r => r.productId !== productId);
      allReviews = [...allReviews, ...newReviews];
    } else {
      allReviews = newReviews;
    }

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
    setReviews(newReviews);
  };

  const addReview = (rating: number, comment: string, userName?: string, isAnonymous: boolean = false) => {
    if (!productId) return;

    const newReview: Review = {
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      rating,
      comment,
      userName: isAnonymous ? undefined : userName,
      date: new Date().toISOString(),
      isAnonymous
    };

    const newReviews = [...reviews, newReview];
    saveReviews(newReviews);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  return {
    reviews,
    addReview,
    getAverageRating,
    getRatingDistribution
  };
};