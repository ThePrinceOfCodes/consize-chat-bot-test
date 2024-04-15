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
  try {
    // Concurrently fetch sections and course
    const [sections, course] = await Promise.all([
      Sections.find({ course: courseId }),
      Course.findById(courseId)
    ]);

    // Error handling if course is not found
    if (!course) {
      throw new Error('Course not found');
    }

    const content = `course title: ${course.title}                   course description: ${course.description}`

    // Construct course flow array
    const courseFlow = [
      { type: "text", content: content },
      ...sections // Spread sections array directly
    ];

    // Cache courseFlow to Redis
    await redisClient.set(`courseflow:${courseId}`, JSON.stringify(courseFlow));

    return courseFlow;
  } catch (error) {
    // Handle errors
    console.error('Error updating course flow:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}

export const getCourseFlow = async (courseId: string) => {

  const courseFlow = await redisClient.get(`courseflow:${courseId}`);
  
  if (!courseFlow) {
    return;
  }

  const parsedCourseFlow = JSON.parse(courseFlow);

  return parsedCourseFlow;
}