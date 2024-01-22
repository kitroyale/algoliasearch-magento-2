<?php

namespace Algolia\AlgoliaSearch\Model\Backend;

use Magento\Config\Model\Config\Backend\Serialized;

/**
 * Algolia custom facet backend model
 */
class Facets extends Serialized
{
    public function beforeSave()
    {
        $values = $this->getValue();

        if ($values || !is_array($values)) {
            $values = json_decode($values);
            $error = json_last_error();
            if ($error) {
                throw new LocalizedException(
                    __('JSON provided for "%1" field is not valid JSON.', self::class)
                );
            }
        }
        
        if (is_array($values)) {
            unset($values['__empty']);
        }

        // Adding query rule config (set to "no") in case the select doesn't appear in the form
        foreach ($values as &$facet) {
            if (!isset($facet['create_rule'])) {
                $facet['create_rule'] = '2';
            }
        }

        $this->setValue($values);

        return parent::beforeSave();
    }
}
