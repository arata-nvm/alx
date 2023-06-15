import { useState } from "react";
import { useToast } from "../components/ui/use-toast";
import { Course, CourseCode, takeCourse } from "../models/course";
import { RequiredCourse, loadRequiredCourses } from "../models/required";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Toaster } from "../components/ui/toaster";


export interface RequiredCourseViewProps {
  courses: Array<Course>,
  setCourses: (courses: Array<Course>) => void,
}

export function RequiredCourseView({ courses, setCourses }: RequiredCourseViewProps) {
  const { toast } = useToast();
  const requiredCourses = loadRequiredCourses();
  const [selectedCourseCodes, setCourseCodes] = useState<Array<Array<CourseCode>>>(new Array(requiredCourses.length));

  const onClick = () => {
    toast({
      title: '必修科目を追加しました',
    });

    let newCourses = [...courses];
    selectedCourseCodes.forEach(codes =>
      codes.forEach(code => {
        const course = newCourses.find(course => course.code == code);
        if (!course) return;
        if (course.status == 'default') {
          newCourses = takeCourse(newCourses, code);
        }
      })
    );
    setCourses(newCourses);
  };

  const onChange = (index: number, name: string) => {
    const option = requiredCourses[index].options?.find(option => option.name == name);
    if (option === undefined) {
      return;
    }

    setCourseCodes((prev) => {
      prev[index] = option.courseCodes;
      return prev;
    });
  };

  return (
    <div className='max-w-md mx-auto'>
      <div className='flex flex-col gap-y-2 mb-4'>
        {requiredCourses.map((required, index) => <RequiredCourseOptionItem key={required.name} required={required} onChange={name => onChange(index, name)} />)}
      </div>
      <Button onClick={onClick}>必修科目を追加する</Button>
      <Toaster />
    </div>
  );
}

interface RequiredCourseOptionItemProps {
  required: RequiredCourse,
  onChange: (name: string) => void,
}

function RequiredCourseOptionItem(props: RequiredCourseOptionItemProps) {
  const donothingItem = { name: "追加しない", courseCodes: [] };
  const options = [donothingItem, ...props.required.options || []];

  return (
    <div>
      <p className='text-start font-semibold'>{props.required.name}</p>
      <Select onValueChange={(value: string) => props.onChange(value)} defaultValue='追加しない'>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => <SelectItem key={option.name} value={option.name}>{option.name}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
