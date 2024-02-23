import axios from 'axios';
export const initFacebookSdk = () => {
  return new Promise((resolve, reject) => {
    // Load the Facebook SDK asynchronously
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });
      // Resolve the promise when the SDK is loaded
      resolve();
    };
  });
};
export const getFacebookLoginStatus = async () => {
  return new Promise((resolve, reject) => {
    window.FB.getLoginStatus((response) => {
      resolve(response);
    });
  });
};

export const fbLogin = async () => {
  return new Promise((resolve, reject) => {
    window.FB.login(
      (response) => {
        resolve(response);
      },
      {
        scope:
          'public_profile,email,pages_show_list,pages_read_engagement,pages_messaging,pages_manage_metadata',
      },
    );
  });
};

export const fbLogout = async () => {
  return new Promise((resolve, reject) => {
    window.FB.logout((response) => {
      resolve(response);
    });
  });
};

export const getPageTokens = async (accessToken) => {
  const response = await axios.get(
    `https://graph.facebook.com/me/accounts?access_token=${accessToken}`,
  );
  return response.data;
};

export const getPageToken = async (pageId, accessToken) => {
  const response = await axios.get(
    `https://graph.facebook.com/${pageId}?fields=access_token&access_token=${accessToken}`,
  );

  return response.data.access_token;
};

export const subscribeToWebhook = async (accessToken) => {
  const pageTokens = await getPageTokens(accessToken);

  await pageTokens?.data.map(async (page) => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/${page.id}/subscribed_apps?subscribed_fields=messages,messaging_postbacks&access_token=${page.access_token}`,
      headers: {
        Cookie: 'ps_l=0; ps_n=0',
      },
    };

    await axios.post(config.url, config);
    console.log('webhook subscribed');
  });
};

export const getUserProfile = async (userId, pageId, userAccessToken) => {
  const accessToken = await getPageToken(pageId, userAccessToken);
  const result = await axios.get(
    `https://graph.facebook.com/${userId}?fields=first_name,last_name,profile_pic&access_token=${accessToken}`,
  );
  console.log(result.data);
  return result.data;
};

export const sendMessage = async (
  recipientId,
  pageId,
  userAccessToken,
  message,
) => {
  const accessToken = await getPageToken(pageId, userAccessToken);
  let data = JSON.stringify({
    recipientId: `${recipientId}`,
    pageId: `${pageId}`,
    message: `${message}`,
    page_token: `${accessToken}`,
  });

  console.log(data);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/api/conversation',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};
