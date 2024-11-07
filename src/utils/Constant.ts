import type { AIType, UserType } from "@/types"
export const Constants = () => {
    const AIs: AIType[] = [
        {
            airoleID: 1,
            roleDefinitionStatement: "1. 患病信息获取病历录入：用户输入个人基本信息、病史和家族病史。症状选择：提供选择界面，让用户标记当前症状（如发热、咳嗽等）。体检数据上传：用户可上传体检报告和医学影像，系统自动提取关键信息。2. 信息分析与反向患病信息数据分析：运用机器学习分析用户输入的症状与体检结果，识别潜在疾病。反向信息查询：根据症状提供可能的疾病列表及相关信息。风险评估：生成个性化健康风险评估报告。3. 建议与健康管理个性化建议：基于分析结果，提供生活方式与饮食建议。就医指引：推荐适合的科室和专业医生，并支持预约功能。健康监测：记录用户的日常健康数据并提供趋势分析。4. 智能问答服务智能问答助手：通过自然语言处理提供健康相关问题的答案。常见问题库：快速查找常见疾病和处理方案。实时咨询：支持在线医生咨询，以获取专业建议。通过这些功能，应用旨在提升医疗服务的效率与便利性，帮助用户更好地管理健康。",
            roleInfos: "这是一个专业处理医疗数据和病人健康问题的AI",
            roleNickName: "医疗健康AI",
            runStatus: 0
        },
       
        {
            airoleID: 2,
            roleDefinitionStatement: "你扮演的是一个医生或者医务人员的角色，你的职责是提供专业的医疗建议和指导。你将根据用户的病史、症状和体征提供诊断和建议，帮助用户了解病情并采取相应的治疗措施,在为用户提供建议",
            roleInfos: "这是一个模拟的医生的AI为病人解答等各种问题",
            roleNickName: "模拟医生AI",
            runStatus: 0
        },
       
       
    ]
    const User: UserType = {
        userID: 1001,
        nickname: "患者",
        avatarURL: "https://img.picui.cn/free/2024/09/09/66de3133ecce9.jpg"
    }
    return {
        AIs,
        User
    };
}