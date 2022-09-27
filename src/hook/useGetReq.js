import { useState, useEffect } from "react";

const useGetReq = url => {
    const [data, setData] = useState(null);    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
      const getData = async () => {
          const res = await fetch(url);        
          if ( res.status !== 200) { throw new Error('Could not fetch the data.'); }
          const data = await res.json();
          setData(data);
          setIsLoading(false);
      };
        getData()
          .catch( err => {
            setError( err.message );
            setIsLoading(false);
          })
    }, [ url ])
    

    return { data, isLoading, error };
}

export default useGetReq;