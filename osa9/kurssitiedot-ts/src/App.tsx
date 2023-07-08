interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartWithDescription {
  requirements: string[],
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

interface HeaderProps {
  courseName: string;
}

const Header = (props: HeaderProps) => (
  <>
    <h1>{props.courseName}</h1>
  </>
);

interface PartProps {
  part: CoursePart;
}

const Base = (props: CoursePartBase) => (
  <h4>{props.name} {props.exerciseCount}</h4>
);

type BasicProps = Omit<CoursePartBasic, "kind">;

const Basic = (props: BasicProps) => (
  <>
    <Base name={props.name} exerciseCount={props.exerciseCount} />
    <p><i>{props.description}</i></p>
  </>
);

type GroupProps = Omit<CoursePartGroup, "kind">;

const Group = (props: GroupProps) => (
  <>
    <Base name={props.name} exerciseCount={props.exerciseCount} />
    <p>project exercises: {props.groupProjectCount}</p>
  </>
);

type BackgroundProps = Omit<CoursePartBackground, "kind">;

const Background = (props: BackgroundProps) => (
  <>
    <Basic
      name={props.name}
      exerciseCount={props.exerciseCount}
      description={props.description}
    />
    <p>Background material: {props.backgroundMaterial}</p>
  </>
);

type SpecialProps = Omit<CoursePartSpecial, "kind">;

const Special = (props: SpecialProps) => (
  <>
    <Basic
      name={props.name}
      exerciseCount={props.exerciseCount}
      description={props.description}
    />
    <p>Requirements: {props.requirements.join(", ")}</p>
  </>
);

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = (props: PartProps) => {
  const { part } = props;
  switch (part.kind) {
    case "basic":
      return (
        <Basic
          name={part.name}
          exerciseCount={part.exerciseCount}
          description={part.description}
        />
      );
    case "group":
      return (
        <Group
          name={part.name}
          exerciseCount={part.exerciseCount}
          groupProjectCount={part.groupProjectCount}
        />
      );
    case "background":
      return (
        <Background
          name={part.name}
          exerciseCount={part.exerciseCount}
          description={part.description}
          backgroundMaterial={part.backgroundMaterial}
        />
      );
    case "special":
      return (
        <Special
          name={part.name}
          exerciseCount={part.exerciseCount}
          description={part.description}
          requirements={part.requirements}
        />
      );
    default:
      console.log(assertNever(part));
      return null;
  }
};

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = (props: ContentProps) => {
  const { courseParts } = props;
  return (
    <>
      {courseParts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </>
  )
};

interface TotalProps {
  courseParts: CoursePart[];
}

const Total = (props: TotalProps) => {
  const { courseParts } = props;
  return (
    <h4>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </h4>
  )
};

const App = () => {
  const courseName = "Half Stack application development";

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
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
