import { CourseInterface, CreateCoursePayload } from './interfaces.courses'
import Course from './model.courses'
import { CreateLessonPayload, LessonInterface } from './interfaces.lessons'
import Lessons from './model.lessons'
import { SectionInterface, CreateSectionPayload } from './interfaces.section'
import Sections from './model.section'
import { redisClient } from './redis'

//course
export const createCourse = async (coursePayload: CreateCoursePayload): Promise<CourseInterface> => {
  const course = new Course({ ...coursePayload })
  await course.save()
  return course
}

// lessons
export const createLesson = async (lessonPayload: CreateLessonPayload, course: string): Promise<LessonInterface> => {
  const lesson = new Lessons({ ...lessonPayload, course })
  await Course.findByIdAndUpdate(course, { $push: { lessons: lesson.id } })
  await lesson.save()
  return lesson
}

// sections
export const createSection = async (sectionPayload: CreateSectionPayload, lesson: string, course: string): Promise<SectionInterface> => {
  const section = new Sections({ ...sectionPayload, lesson, course })
  await Lessons.findByIdAndUpdate(section, { $push: { sections: section.id } })
  await Course.findByIdAndUpdate(section, { $push: { sections: section.id } })
  await section.save()
  return section
}

//course flow
export const updateCourseFlow = async (courseId: string) => {
  let courseFlow = [];

  const sections = await Sections.find({ course: courseId }); 
  const course = await Course.findById(courseId);

  if (!course) {
    return
  }

  courseFlow.push({ type: "text", content: course.title });

  sections.forEach(section => {
    courseFlow.push(section);
  });

  // Cache courseFlow to Redis
  redisClient.set(`courseFlow:${courseId}`, JSON.stringify(courseFlow));

  return courseFlow;
}

export const getCourseFlow = async (courseId: string) => {
  const courseFlow = await redisClient.get(`courseFlow:${courseId}`);
  
  if (!courseFlow) {
    return;
  }

  const parsedCourseFlow = JSON.parse(courseFlow);

  return parsedCourseFlow;
}