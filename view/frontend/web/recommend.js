define([
    'algoliaBundle',
    'recommend',
    'recommendJs',
    'recommendItemsElement',
    'domReady!'
],function (algoliaBundle, recommend, recommendJs, recommendItemsElement) {
    'use strict';

    return function (config, element) {
        algoliaBundle.$(function ($) {
            this.defaultIndexName = algoliaConfig.indexName + '_products';
            const appId = algoliaConfig.applicationId;
            const apiKey = algoliaConfig.apiKey;
            const recommendClient = recommend(appId, apiKey);
            const indexName = this.defaultIndexName;
            if ($('body').hasClass('catalog-product-view') || $('body').hasClass('checkout-cart-index')) {
                // --- Add the current product objectID here ---
                if ((algoliaConfig.recommend.enabledFBT && $('body').hasClass('catalog-product-view')) || (algoliaConfig.recommend.enabledFBTInCart && $('body').hasClass('checkout-cart-index'))) {
                    recommendJs.frequentlyBoughtTogether({
                        container: '#frequentlyBoughtTogether',
                        recommendClient,
                        indexName,
                        objectIDs: config.algoliObjectId,
                        maxRecommendations: algoliaConfig.recommend.limitFBTProducts,
                        itemComponent({item, createElement, Fragment}) {
                            if (algoliaConfig.recommend.isAddToCartEnabledInFBT) {
                                return recommendItemsElement.getRecommendItemsWithAddToCart(item, createElement);
                            } else {
                                return recommendItemsElement.getRecommendDataWithNoAddToCart(item, createElement);
                            }
                        },
                    });
                }
                if ((algoliaConfig.recommend.enabledRelated && $('body').hasClass('catalog-product-view')) || (algoliaConfig.recommend.enabledRelatedInCart && $('body').hasClass('checkout-cart-index'))) {
                    recommendJs.relatedProducts({
                        container: '#relatedProducts',
                        recommendClient,
                        indexName,
                        objectIDs: config.algoliObjectId,
                        maxRecommendations: algoliaConfig.recommend.limitRelatedProducts,
                        itemComponent({item, createElement, Fragment}) {
                            if (algoliaConfig.recommend.isAddToCartEnabledInRelatedProduct) {
                                return recommendItemsElement.getRecommendItemsWithAddToCart(item, createElement);
                            } else {
                                return recommendItemsElement.getRecommendDataWithNoAddToCart(item, createElement);
                            }
                        },
                    });
                }
            }

            if ((algoliaConfig.recommend.isTrendItemsEnabledInPDP && $('body').hasClass('catalog-product-view')) || (algoliaConfig.recommend.isTrendItemsEnabledInCartPage && $('body').hasClass('checkout-cart-index'))) {
                recommendJs.trendingItems({
                    container: '#trendItems',
                    facetName: algoliaConfig.recommend.trendItemFacetName ? algoliaConfig.recommend.trendItemFacetName : '',
                    facetValue: algoliaConfig.recommend.trendItemFacetValue ? algoliaConfig.recommend.trendItemFacetValue : '',
                    recommendClient,
                    indexName,
                    maxRecommendations: algoliaConfig.recommend.limitTrendingItems,
                    itemComponent({item, createElement, Fragment}) {
                        if (algoliaConfig.recommend.isAddToCartEnabledInTrendsItem) {
                            return recommendItemsElement.getRecommendItemsWithAddToCart(item, createElement);
                        } else {
                            return recommendItemsElement.getRecommendDataWithNoAddToCart(item, createElement);
                        }
                    },
                });
            } else if (algoliaConfig.recommend.enabledTrendItems && typeof config.recommendTrendContainer !== "undefined") {
                let containerValue = "#" + config.recommendTrendContainer;
                recommendJs.trendingItems({
                    container: containerValue,
                    facetName: config.facetName ? config.facetName : '',
                    facetValue: config.facetValue ? config.facetValue : '',
                    recommendClient,
                    indexName,
                    maxRecommendations: config.numOfTrendsItem ? parseInt(config.numOfTrendsItem) : algoliaConfig.recommend.limitTrendingItems,
                    itemComponent({item, createElement, Fragment}) {
                        if (algoliaConfig.recommend.isAddToCartEnabledInTrendsItem) {
                            return recommendItemsElement.getRecommendItemsWithAddToCart(item, createElement);
                        } else {
                            return recommendItemsElement.getRecommendDataWithNoAddToCart(item, createElement);
                        }
                    },
                });
            }
        });
    }
});
