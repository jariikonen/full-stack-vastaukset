import { React, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Blog from './Blog';

const BlogAccordion = ({ blog, likeBlog, removeBlog }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleSize = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="blog">
      <Accordion
        expanded={expanded}
        onChange={toggleSize}
        disableGutters
        sx={{ boxShadow: 0 }}
      >
        <AccordionSummary
          expandIcon={expanded ? <Button>hide</Button> : <Button>view</Button>}
          sx={{
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: 'rotate(0deg)',
            },
          }}
        >
          <Link
            component={RouterLink}
            to={`/blogs/${blog.id}`}
            color="primary"
            underline="hover"
          >
            {blog.title} {blog.author}
          </Link>
        </AccordionSummary>
        <AccordionDetails>
          <Blog blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default BlogAccordion;
