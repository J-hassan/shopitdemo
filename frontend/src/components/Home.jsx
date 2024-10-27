import React, { useEffect } from 'react'
import MetaData from './layout/MetaData'
import {useGetProductsQuery} from "../redux/api/productsApi"
import Productitems from './Products/Productitems';
import Loader from './layout/Loader';
import toast from 'react-hot-toast';
import CustomPagination from './layout/CustomPagination';
import { useSearchParams } from 'react-router-dom';
import Filters from './layout/Filters';

const Home = () => {

  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";

  const min = searchParams.get("min");
  const max = searchParams.get("max");

  const category = searchParams.get("category");
  const rating = searchParams.get("rating");

  const params = {page}

  if (keyword !== "") params.keyword = keyword;
  if (min !== null) params.min = min;
  if (max !== null) params.max = max;
  if (category !== null) params.category = category;
  if (rating !== null) params.rating = rating;
    
  const { data , isLoading , error , isError } = useGetProductsQuery(params);


  useEffect(()=>{
    if(isError){
      toast.error(error?.data?.message)
    }
  },[isError])

  if(isLoading) return <Loader />

  const colSize = keyword ? 4 : 3;

  return (
    <>
      <MetaData title={'Buy Best Products Online'} />
      <div className="row">

      {keyword && 
      <div className='col-6 col-md-3 col-sm-6 mt-5'>
        <Filters />
      </div>
      }

        <div className={keyword? "col-12 col-sm-6 col-md-9" : "col-12 col-sm-6 col-md-12"}>
          <h1 id="products_heading" className="text-secondary">{keyword? `${data?.products?.length} Product(s) Found with keyword: ${keyword}` :"Latest Products"}</h1>

          <section id="products" className="mt-5">
            <div className="row">
              {data?.products?.map((product,index)=>{
                return <Productitems product={product} key={index} colSize={colSize}/>
              })}
            </div>
          </section>

              <CustomPagination resPerPage={data?.resPerPage} filteredProductsCount={data?.filteredProductsCount} currentPage={page}/>

        </div>
      </div>
    </>
  );
};


export default Home;