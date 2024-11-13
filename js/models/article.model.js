// #region GET PRODUCT BY REFERENCE
export const getProductByReference = async (refProducto) => {
    console.log("refProducto:", refProducto);
    const url = `${JSON_PRODUCTOS}?referencia=${refProducto}`;
    console.log("url:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener el producto');

        const products = await response.json();
        console.log("products:", products);

        return products.length > 0 ? products[0] : null;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

// #region GET ARTICLE BY BARCODE
export const getArticleByBarcode = async (barcode) => {
    try {
        const response = await fetch(JSON_PRODUCTOS);
        if (!response.ok) throw new Error('Error al obtener los productos');
        const products = await response.json();

        for (const product of products) {
            for (const color in product.articulos) {
                const articles = product.articulos[color];
                for (const article of articles) {
                    if (article.barcode === barcode) {
                        return {
                            ...article,
                            nom_prod: product.nom_prod,
                            referencia: product.referencia,
                            titulo: product.titulo,
                            img_prod: product.img_prod
                        };
                    }
                }
            }
        }

        return null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};


