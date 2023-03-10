package mpti.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import mpti.common.errors.TokenNotFoundException;
import mpti.domain.trainer.application.TrainerAuthService;
import mpti.domain.trainer.dto.TokenDto;
import org.hibernate.annotations.Filter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class TokenAuthenticationFilter extends OncePerRequestFilter {
    private TokenProvider tokenProvider;
    private TrainerAuthService trainerAuthService;

    private static final Logger logger = LoggerFactory.getLogger(TokenAuthenticationFilter.class);

    @Value("${app.auth.tokenSecret:}")
    private String SECRET_KEY;

    private static final String AUTHORITIES_KEY = "auth";

    public TokenAuthenticationFilter(TokenProvider tokenProvider, TrainerAuthService trainerAuthService) {
        this.tokenProvider = tokenProvider;
        this.trainerAuthService = trainerAuthService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException, TokenNotFoundException, ExpiredJwtException {

        try {
            String accessToken = getJwtFromRequest(request);
            String refreshToken = getRefreshJwtFromRequest(request);

            if (!StringUtils.hasText(accessToken) ) {
                throw new TokenNotFoundException("Access ????????? ?????? ??? ????????????");
            }

            if( tokenProvider.validateToken(accessToken)) {

//                Authentication auth = tokenProvider.getAuthentication(accessToken);// ?????? ?????? ??????
                UsernamePasswordAuthenticationToken authentication = tokenProvider.getAuthentication(accessToken);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);


            } else if( tokenProvider.isExpiredToken(accessToken)) {
                logger.info("Access token is expired");
                if(tokenProvider.validateToken(refreshToken)) {
                    // Redis DB??? ??????

                    TokenDto tokenDto = trainerAuthService.getNewAccessToken(refreshToken);
                    if(tokenDto.getState() == false) {
                        throw new ExpiredJwtException(null, null, "Refresh ????????? ????????????????????? ?????? ????????? ????????????");
                    } else {
                        // Redis DB ?????? ?????? ??? access token ????????? -> ?????? ????????????
                        accessToken = tokenDto.getAccessToken();
                        UsernamePasswordAuthenticationToken authentication = tokenProvider.getAuthentication(accessToken);
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        response.setHeader("Authorization", "Bearer " + accessToken);
                    }

                } else {
                    throw new JwtException("Refresh ????????? ???????????? ????????????");
                }
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
            throw new IllegalArgumentException(ex);
        }

        logger.info("?????? ?????? ??????");
        filterChain.doFilter(request, response);

    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }

    private String getRefreshJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Refresh-token");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }

}
