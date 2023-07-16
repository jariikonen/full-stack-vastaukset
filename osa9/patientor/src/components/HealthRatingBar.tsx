import { Rating, Typography, Stack } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

import { styled } from '@mui/material/styles';

type BarProps = {
  rating: number;
  showText: boolean;
};

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  }
});

const HEALTHBAR_TEXTS = [
  "The patient is in great shape",
  "The patient has a low risk of getting sick",
  "The patient has a high risk of getting sick",
  "The patient has a diagnosed condition",
];

const HealthRatingBar = ({ rating, showText }: BarProps) => {
  return (
    <div className="health-bar">
      <Stack direction="row" spacing={1}>
        <StyledRating
          readOnly
          value={4 - rating}
          max={4}
          icon={<Favorite fontSize="inherit" />}
          emptyIcon={<FavoriteBorder fontSize="inherit" />}
        />
        {showText
          ? <Typography variant="body1">
              {HEALTHBAR_TEXTS[rating]}
            </Typography>
          : null}
      </Stack>
    </div>
  );
};

export default HealthRatingBar;
