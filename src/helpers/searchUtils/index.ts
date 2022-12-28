import axios from 'axios';
import {
    centrecomSearchProductHTMLNodeToProduct,
    computerAllianceSearchProductHTMLNodeToProduct,
    msySearchProductHTMLNodeToProduct,
    pcCaseGearSearchProductHTMLNodeToProduct,
    scorptecSearchProductHTMLNodeToProduct,
} from 'helpers/parsers';
import WebScrapper from 'helpers/Scrapper/scrapper';
import _ from 'lodash';
import { Product, ProductVendor } from 'types';

const proxy = process.env.REACT_APP_PROXY_URL ?? '';

export const searchPleComputersProducts = async (searchTerm: string): Promise<Product> => {
    const json = {
        MaximumNumberOfItems: 50,
        OnlyWebsiteSpotlight: false,
        ReturnAttributes: true,
        ReturnCategories: true,
        ReturnMarketingDescription: true,
        SearchString: searchTerm,
    };
    const response = await axios.create({
        baseURL: proxy + 'https://www.ple.com.au/api/',
    }).post('getItemGrid', json, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return (response.data.data['Items'] ?? []).map((item: any) => ({
        name: (item['ManufacturerName'] ?? '') + ' ' + (item['ManufacturerModel'] ?? ''),
        image: `https://plecom.imgix.net/iil-${item['PrimaryImageId']}-${item['InventoryItemId']}.jpg?auto=format&w=350&h=350`,
        info: [{
            inStock: _.some(item['Availabilities'].filter((e: any) => e.State === 'VIC'), (i) => i.InStock === true),
            url: 'https://www.ple.com.au/' + item['ItemUrl'],
            description: item.ItemDescription,
            price: String(item['RetailPriceIncTax']),
            originalPrice: item['RRPPriceIncTax'] ?? 0,
            vendor: ProductVendor.PLE_COMPUTERS,
        }],

    }) as Product);
}


export const searchPcCaseGearProducts = async (searchTerm: string) => {
    const response = await axios.create({
        baseURL: proxy + 'https://hpd3dbj2io-3.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%20(lite)&x-algolia-application-id=HPD3DBJ2IO&x-algolia-api-key=9559cf1a6c7521a30ba0832ec6c38499',
    }).post('', `{"requests":[{"indexName":"pccg_products","params":"query=${searchTerm}&maxValuesPerFacet=128&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&facets=%5B%22manufacturers_name%22%2C%22indicator.filter%22%2C%22products_price%22%2C%22categories.lvl0%22%5D&tagFilters="}]}`);
    return response.data.results[0].hits.map(pcCaseGearSearchProductHTMLNodeToProduct)
}

export const searchScorptecProducts = async (searchTerm: string) => {
    let scorptecScrapper = new WebScrapper(proxy + 'https://computers.scorptec.com.au');
    const htmlContent = await scorptecScrapper.getHTMLFromPathWithParams(`/search`, {
        w: searchTerm
    }); // get the html content
    const content = htmlContent.querySelector('.content-wrapper'); // get the content wrapper
    const products = content?.querySelectorAll('.product-list-detail') ?? [];
    return products?.map(scorptecSearchProductHTMLNodeToProduct) ?? []
}


export const searchCentrecomProducts = async (searchTerm: string) => {
    const products = await axios.create({
        baseURL: proxy + 'https://computerparts.centrecom.com.au/api/search',
    }).get('', {
        params: {
            q: searchTerm,
            cid: '0ae1fd6a074947699fbe46df65ee5714',
            ps: 32
        }
    }).then((res) => res.data.p.map(centrecomSearchProductHTMLNodeToProduct)).catch(e => console.error(e));
    return products;
}

export const searchMSYProducts = async (searchTerm: string) => {
    let msyScrapper = new WebScrapper(proxy + 'https://www.msy.com.au');
    const htmlContent = await msyScrapper.getHTMLFromPathWithParams(`/search.php`, {
        cat_id: '',
        keywords: searchTerm
    }); // get the html content
    const products = htmlContent?.querySelectorAll('.goods_info') ?? [];
    return products?.map(msySearchProductHTMLNodeToProduct) ?? []
}

export const searchComputerAllianceProducts = async (searchTerm: string) => {
    let computerAllianceScrapper = new WebScrapper(proxy + 'https://www.computeralliance.com.au');
    const htmlContent = await computerAllianceScrapper.getHTMLFromPathWithParams(`/search`, {
        search: searchTerm
    }); // get the html content
    const products = htmlContent?.querySelectorAll('.product') ?? [];
    return products?.map(computerAllianceSearchProductHTMLNodeToProduct) ?? []
}


const integrations = [
    searchPleComputersProducts,
    searchPcCaseGearProducts,
    searchScorptecProducts,
    searchCentrecomProducts,
    searchMSYProducts,
    searchComputerAllianceProducts
];
export default integrations;