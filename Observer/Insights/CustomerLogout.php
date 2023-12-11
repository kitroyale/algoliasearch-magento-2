<?php

namespace Algolia\AlgoliaSearch\Observer\Insights;

use Algolia\AlgoliaSearch\Helper\InsightsHelper;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Stdlib\Cookie\CookieMetadataFactory;
use Magento\Framework\Stdlib\Cookie\PhpCookieManager;

class CustomerLogout implements ObserverInterface
{
    /**
     * @var PhpCookieManager
     */
    private $cookieManager;

    /**
     * @var CookieMetadataFactory
     */
    private $cookieMetadataFactory;

    /**
     * RefreshCustomerData constructor.
     * @param PhpCookieManager $cookieManager
     * @param CookieMetadataFactory $cookieMetadataFactory
     */
    public function __construct(
        PhpCookieManager $cookieManager,
        CookieMetadataFactory $cookieMetadataFactory
    ) {
        $this->cookieManager = $cookieManager;
        $this->cookieMetadataFactory = $cookieMetadataFactory;
    }

    /**
     * Check and clear session data if persistent session expired
     *
     * @param \Magento\Framework\Event\Observer $observer
     * @return void
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        if ($this->cookieManager->getCookie(InsightsHelper::ALGOLIA_CUSTOMER_USER_TOKEN_COOKIE_NAME)) {
            $metadata = $this->cookieMetadataFactory->createCookieMetadata();
            $metadata->setPath('/');
            $this->cookieManager->deleteCookie(InsightsHelper::ALGOLIA_CUSTOMER_USER_TOKEN_COOKIE_NAME, $metadata);
        }
    }
}