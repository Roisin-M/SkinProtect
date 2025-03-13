const getReapplicationRecommendation = (skinType: string | number, uvIndex: any,spfFactor: any,activity: any,exposure: any ) => {
  let score = 0;

  //add scores to skin types
//   Type II (Fair)';
//     if (score <= 19) return 'Type III (Medium)';
//     if (score <= 25) return 'Type IV (Olive)';
//     if (score <= 31) return 'Type V (Brown)';
//     return 'Type VI (Black)';
  switch (skinType) {
    case 'Type I (Very Fair)': { 
        score += 3; 
        break; 
     } 
     case 'Type II (Fair)': { 
        score += 3; 
        break; 
     } 
     case 'Type III (Medium)': { 
        score += 2; 
        break; 
     } 
     case 'Type IV (Olive)': { 
        score += 2; 
        break; 
     } 
     case 'Type V (Brown)': { 
        score += 1; 
        break; 
     } 
     case 'Type VI (Black)': { 
        score += 1; 
        break; 
     } 
     default: { 
        score += 0; 
        break; 
     } 
  }
  
  //add uv index scores
  if (uvIndex < 3)
    score += 0;
  else if (uvIndex >= 3 && uvIndex < 6)
    score += 1;
  else if (uvIndex >= 6 && uvIndex < 8)
    score += 2;
  else if (uvIndex >= 8)
    score += 3;

  //scores for spf factor used
  if (spfFactor <= 15)
    score += 3;
  else if (spfFactor > 15 && spfFactor <= 30)
    score += 2;
  else if (spfFactor > 30)
    score += 1;

  //add scores to activities and exposure
  if (activity === "Mostly Inside")
    score += 0;
  else if (activity === "Mostly Outside")
  {
    if(exposure === "Not Exposed")
        score += 2;
    else //exposed
        score += 3;
  }
  else if (activity === "Both")
  {
    if (exposure === "Not Exposed")
        score += 1;
    else //exposed
        score += 3;
  }

  //map scores to reapplication cases + return reapplication every 2 hours if uv is high
  if(uvIndex >= 6)
  {
    return 4;
  } else {
    if (score <= 2) return 1;
    if (score > 2 && score <= 5) return 2;
    if (score > 5 && score <= 8) return 3;
    return 4;
  }

};

export default getReapplicationRecommendation;