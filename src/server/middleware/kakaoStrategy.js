const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;

const User = require("../model/user");

const kakao = () => {
  passport.use(
    new kakaoStrategy(
      {
        clientID: "kakaoid",
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile) => {
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account_email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};

module.exports = kakao;
