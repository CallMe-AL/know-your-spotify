import { useState, useEffect } from "react";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    
    fetch("/api/callback" + window.location.search, {
      credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setExpiresIn(data.expiresIn);
      window.history.pushState({}, null, "/dashboard")
    })
    .catch((err) => {
      console.log(err);
    });
  }, [code]);

  useEffect(() => {

    const callRefresh = async () => {
      try {
        const query = `/?refresh_token=${refreshToken}`;
        const res = await fetch("/api/refresh_token" + query)
        const json = await res.json()
        
        setAccessToken(json.access_token);
        setExpiresIn(json.expires_in);
        
      } catch(err) {
        console.log(err);
        // window.location = "/";
      }
    }
    
    if (!refreshToken || !expiresIn) {
      return;
    } else {
      let interval = setInterval(callRefresh, (expiresIn - 60) * 1000);
      callRefresh();
  
      return () => clearInterval(interval);
    }
  }, [refreshToken, expiresIn]);
  
  return accessToken;
}