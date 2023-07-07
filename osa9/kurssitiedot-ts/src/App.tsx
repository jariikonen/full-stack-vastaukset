interface HeaderProps {
  courseName: string;
}

const Header = (props: HeaderProps) => (
  <>
    <h1>{props.courseName}</h1>
  </>
);

interface CourseParts {
  name: string;
  exerciseCount: number;
}

interface ContentProps {
  courseParts: CourseParts[];
}

const Content = (props: ContentProps) => {
  const { courseParts } = props;
  return (
    <>
      <p>
        {courseParts[0].name} {courseParts[0].exerciseCount}
      </p>
      <p>
        {courseParts[1].name} {courseParts[1].exerciseCount}
      </p>
      <p>
        {courseParts[2].name} {courseParts[2].exerciseCount}
      </p>
    </>
  )
};

interface TotalProps {
  courseParts: CourseParts[];
}

const Total = (props: TotalProps) => {
  const { courseParts } = props;
  return (
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  )
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
