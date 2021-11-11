import React, { useEffect, useState} from 'react'
import { useParams } from 'react-router';
import { getFirestore } from '../../firebase';
import Item from '../../components/Item';

const ItemListContainer = () => {
    const { categoryId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([])

    // useEffect(() => {
    //     if (categoryId) {
    //         const findProduct = products.filter(
    //           (categoryProp) => categoryProp.category === categoryId 
    //         );
    //         setProductByCategory(findProduct);
    //     }else{
    //         setProductByCategory(products);
    //     }
    // }, [categoryId]);

    useEffect(() => {
        const db = getFirestore();
        const itemCollection = db.collection('products');

        if(!categoryId){
            itemCollection.get().then(querySnapshot => {
                console.log(querySnapshot);
                if (querySnapshot.size === 0) {
                    console.log("No items");
                    return;
                }
                setProducts(querySnapshot.docs.map(document => ({
                    id: document.id,
                    ...document.data()
                })))
            }).catch(error => console.log(error)).finally(() => setIsLoading(false));
            return
        }

        const productsByCategory = itemCollection.where("categoryId", "==", categoryId)

        productsByCategory.get().then(querySnapshot => {
            console.log(querySnapshot);
            if (querySnapshot.size === 0) {
                console.log("No items");
                return;
            }
            setProducts(querySnapshot.docs.map(document => ({
                id: document.id,
                ...document.data()
            })))
        }).catch(error => console.log(error)).finally(() => setIsLoading(false))

    }, [categoryId])
    
    // if (!productByCategory) {
    //     return null;
    // }

    return (
        <div>
            {/* <ItemList products={productByCategory} /> */}
            {isLoading ? (
                <h1>Loading...</h1>
            ) : (
                <div className="mt-2 wrapItems">
                    {products.map((product) => (
                        <Item key={product.id} {...product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemListContainer;
